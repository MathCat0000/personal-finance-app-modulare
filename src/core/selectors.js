// Selectors derive view data without mutating the state they receive.
import { CATEGORIES, ITEMS_PER_PAGE } from "./constants.js";
import {
  dateForContextDay,
  daysBetween,
  getContextDate,
  isSameMonth,
  percentage,
  toMoney
} from "./utils.js";

export function paginate(items, page = 1, perPage = ITEMS_PER_PAGE) {
  const safePerPage = Math.max(1, Number(perPage) || ITEMS_PER_PAGE);
  const totalPages = Math.max(1, Math.ceil(items.length / safePerPage));
  const currentPage = Math.min(Math.max(Number.parseInt(page, 10) || 1, 1), totalPages);
  const start = (currentPage - 1) * safePerPage;
  return {
    items: items.slice(start, start + safePerPage),
    currentPage,
    totalPages,
    hasPrev: currentPage > 1,
    hasNext: currentPage < totalPages,
    totalItems: items.length
  };
}

export function getIncome(appState) {
  return toMoney(appState.transactions.filter((transaction) => transaction.amount > 0).reduce((sum, transaction) => sum + transaction.amount, 0));
}

export function getExpenses(appState) {
  return toMoney(Math.abs(appState.transactions.filter((transaction) => transaction.amount < 0).reduce((sum, transaction) => sum + transaction.amount, 0)));
}

export function getAvailableBalance(appState) {
  return toMoney(appState.balance.current);
}

export function sortTransactions(transactions, sort = "latest") {
  const sorted = [...transactions];
  const byDateDescending = (a, b) => new Date(b.date) - new Date(a.date);
  const byName = (a, b) => a.name.localeCompare(b.name);
  const byAmount = (a, b) => b.amount - a.amount;
  switch (sort) {
    case "oldest": return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    case "az": return sorted.sort(byName);
    case "za": return sorted.sort((a, b) => byName(b, a));
    case "highest": return sorted.sort(byAmount);
    case "lowest": return sorted.sort((a, b) => byAmount(b, a));
    default: return sorted.sort(byDateDescending);
  }
}

export function getFilteredTransactions(appState, { search = "", category = "", sort = "latest", page = 1 } = {}) {
  const needle = search.trim().toLowerCase();
  const filtered = appState.transactions.filter((transaction) => {
    const matchesSearch = !needle || transaction.name.toLowerCase().includes(needle);
    const matchesCategory = !category || category === "all" || transaction.category === category;
    return matchesSearch && matchesCategory;
  });
  return paginate(sortTransactions(filtered, sort), page);
}

export function getSpentForCategory(appState, category) {
  // Seed data represents a fixed month, so the newest transaction is its clock.
  const contextDate = getContextDate(appState.transactions);
  return toMoney(Math.abs(appState.transactions
    .filter((transaction) => transaction.category === category && transaction.amount < 0 && isSameMonth(transaction.date, contextDate))
    .reduce((sum, transaction) => sum + transaction.amount, 0)));
}

export function getLatestSpendingForCategory(appState, category, count = 3) {
  return sortTransactions(appState.transactions.filter((transaction) => transaction.category === category && transaction.amount < 0)).slice(0, count);
}

export function getBudgetSummary(appState, budget) {
  const spent = getSpentForCategory(appState, budget.category);
  return {
    ...budget,
    spent,
    free: toMoney(Math.max(0, budget.maximum - spent)),
    percentage: percentage(spent, budget.maximum),
    latestSpending: getLatestSpendingForCategory(appState, budget.category)
  };
}

export function getBudgetsWithSummaries(appState) {
  return appState.budgets.map((budget) => getBudgetSummary(appState, budget));
}

export function getAvailableCategories(appState, includeCategory = "") {
  const used = new Set(appState.budgets.map((budget) => budget.category.toLowerCase()));
  const included = String(includeCategory).toLowerCase();
  return CATEGORIES.filter((category) => category.toLowerCase() === included || !used.has(category.toLowerCase()));
}

export function getAllPotsProgress(appState) {
  return appState.pots.map((pot) => ({ ...pot, percentage: percentage(pot.total, pot.target) }));
}

// Recurring transactions are grouped so the UI shows one monthly bill per vendor.
export function buildRecurringBills(appState) {
  const contextDate = getContextDate(appState.transactions);
  const groups = new Map();
  appState.transactions.filter((transaction) => transaction.recurring).forEach((transaction) => {
    if (!groups.has(transaction.name)) groups.set(transaction.name, []);
    groups.get(transaction.name).push(transaction);
  });
  return [...groups.entries()].map(([name, transactions]) => {
    const sorted = sortTransactions(transactions);
    const latest = sorted[0];
    const paidThisMonth = sorted.some((transaction) => isSameMonth(transaction.date, contextDate));
    const dueDay = new Date(latest.date).getUTCDate();
    const dueDate = dateForContextDay(dueDay, contextDate);
    const distance = daysBetween(contextDate, dueDate);
    const status = paidThisMonth ? "paid" : distance >= 0 && distance <= 5 ? "dueSoon" : "upcoming";
    return {
      id: latest.id,
      vendor: name,
      avatar: latest.avatar,
      category: latest.category,
      amount: Math.abs(latest.amount),
      date: latest.date,
      dueDay,
      status
    };
  });
}

export function sortBills(bills, sort = "latest") {
  const sorted = [...bills];
  switch (sort) {
    case "oldest": return sorted.sort((a, b) => b.dueDay - a.dueDay);
    case "az": return sorted.sort((a, b) => a.vendor.localeCompare(b.vendor));
    case "za": return sorted.sort((a, b) => b.vendor.localeCompare(a.vendor));
    case "highest": return sorted.sort((a, b) => b.amount - a.amount);
    case "lowest": return sorted.sort((a, b) => a.amount - b.amount);
    default: return sorted.sort((a, b) => a.dueDay - b.dueDay);
  }
}

export function getRecurringBills(appState, { search = "", sort = "latest", page = 1 } = {}) {
  const needle = search.trim().toLowerCase();
  const bills = buildRecurringBills(appState).filter((bill) => !needle || bill.vendor.toLowerCase().includes(needle));
  return paginate(sortBills(bills, sort), page);
}

export function getRecurringSummary(appState) {
  const bills = buildRecurringBills(appState);
  const amountFor = (status) => toMoney(bills.filter((bill) => bill.status === status).reduce((sum, bill) => sum + bill.amount, 0));
  return {
    total: toMoney(bills.reduce((sum, bill) => sum + bill.amount, 0)),
    paid: amountFor("paid"),
    upcoming: amountFor("upcoming"),
    dueSoon: amountFor("dueSoon"),
    paidCount: bills.filter((bill) => bill.status === "paid").length,
    upcomingCount: bills.filter((bill) => bill.status === "upcoming").length,
    dueSoonCount: bills.filter((bill) => bill.status === "dueSoon").length
  };
}

export function getOverviewData(appState) {
  return {
    balance: getAvailableBalance(appState),
    income: getIncome(appState),
    expenses: getExpenses(appState),
    pots: getAllPotsProgress(appState),
    budgets: getBudgetsWithSummaries(appState),
    recurring: getRecurringSummary(appState),
    recentTransactions: sortTransactions(appState.transactions).slice(0, 5)
  };
}
