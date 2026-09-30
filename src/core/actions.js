import { DEFAULT_AVATAR, MAX_POT_NAME_LENGTH, THEMES } from "./constants.js";
import { state } from "./state.js";
import { saveState } from "./persistence.js";
import { generateId, toMoney } from "./utils.js";


// Helper privati

function requireText(value, label) {
  const text = String(value || "").trim();

  if (!text) throw new Error(`${label} is required.`);

  return text;
}

function requireEmail(value) {
  const email = requireText(value, "Email");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Email must be valid.");
  }
  return email;
}


function requireMoney(value, label) {

  const amount = toMoney(value);
  if (amount <= 0) {
    throw new Error(`${label} must be greater than zero.`);
  }

  return amount;
}


function findById(collection, id, label) {
  const item = collection.find(entry => entry.id === id);
  if (!item) throw new Error(`${label} not found.`);
  return item;
}

function requireDate(value) {
  if (!value) return new Date().toISOString();
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error("Date must be valid.");
  return date.toISOString();
}




export function login({ name, email }) {
  const safeName = requireText(name, "Name");
  const safeEmail = requireEmail(email);
  state.session.name = safeName;
  state.session.email = safeEmail;
  state.session.loggedIn = true;
  saveState();

}

export function logout() {
  state.session.loggedIn = false;
  state.session.name = "";
  state.session.email = "";
  saveState();
}


export function createTransaction({
  name,
  category,
  date,
  amount,
  type = "expense",
  recurring = false
}) {
  const safeName = requireText(name, "Name");
  const safeCategory = requireText(category, "Category");
  const money = requireMoney(amount, "Amount");
  const signedAmount = type === "income" ? money : -money;

  const transaction = {
    id: generateId("transaction"),
    avatar: DEFAULT_AVATAR,
    name: safeName,
    category: safeCategory,
    date: requireDate(date),
    amount: signedAmount,
    recurring: Boolean(recurring)
  };

  state.transactions.unshift(transaction);
  state.balance.current = toMoney(state.balance.current + signedAmount);

  if (signedAmount > 0) {
    state.balance.income = toMoney(state.balance.income + signedAmount);
  } else {
    state.balance.expenses = toMoney(
      state.balance.expenses + Math.abs(signedAmount)
    );
  }

  saveState();

  return transaction;
}


export function deleteTransaction(id) {
  const transaction = findById(state.transactions, id, "Transaction");

  state.transactions = state.transactions.filter((item) => item.id !== id);

  state.balance.current = toMoney(
    state.balance.current - transaction.amount
  );

  if (transaction.amount > 0) {
    state.balance.income = toMoney(
      state.balance.income - transaction.amount
    );
  } else {
    state.balance.expenses = toMoney(
      state.balance.expenses - Math.abs(transaction.amount)
    );
  }

  saveState();

  return transaction;
}


export function createBudget({ category, maximum, theme }) {
  const safeCategory = requireText(category, "Category");

  const safeMaximum = requireMoney(maximum, "Maximum");

  const alreadyExists = state.budgets.some((budget) => budget.category.toLowerCase() === safeCategory.toLowerCase());

  if (alreadyExists) {
    throw new Error("Budget already exists for this category.");
  }

  const budget = {
    id: generateId("budget"),
    category: safeCategory,
    maximum: safeMaximum,
    theme: theme || THEMES[0].value
  };

  state.budgets.push(budget);
  saveState();
  return budget;

}

export function editBudget(id, { maximum, theme } = {}) {
  const budget = findById(state.budgets, id, "Budget");
  budget.maximum = requireMoney(maximum, "Maximum");
  if (theme) budget.theme = theme;
  saveState();
  return budget;
}

export function deleteBudget(id) {
  const budget = findById(state.budgets, id, "Budget");
  state.budgets = state.budgets.filter((item) => item.id !== id);
  saveState();
  return budget;
}

function requirePotName(value) {
  const name = requireText(value, "Name");
  if (name.length > MAX_POT_NAME_LENGTH) {
    throw new Error(`Name must be ${MAX_POT_NAME_LENGTH} characters or fewer.`);
  }
  return name;
}

function hasPotName(name, excludedId = "") {
  return state.pots.some((pot) => pot.id !== excludedId && pot.name.toLowerCase() === name.toLowerCase());
}

export function createPot({ name, target, theme } = {}) {
  const safeName = requirePotName(name);
  const safeTarget = requireMoney(target, "Target");
  if (hasPotName(safeName)) throw new Error("Pot name already exists.");

  const pot = {
    id: generateId("pot"),
    name: safeName,
    target: safeTarget,
    total: 0,
    theme: theme || THEMES[0].value
  };
  state.pots.push(pot);
  saveState();
  return pot;
}

export function editPot(id, { name, target, theme } = {}) {
  const pot = findById(state.pots, id, "Pot");
  const safeName = requirePotName(name);
  const safeTarget = requireMoney(target, "Target");
  if (hasPotName(safeName, id)) throw new Error("Pot name already exists.");

  pot.name = safeName;
  pot.target = safeTarget;
  if (theme) pot.theme = theme;
  saveState();
  return pot;
}

export function addMoneyToPot(id, amount) {
  const pot = findById(state.pots, id, "Pot");
  const safeAmount = requireMoney(amount, "Amount");
  if (safeAmount > state.balance.current) throw new Error("Insufficient balance.");

  pot.total = toMoney(pot.total + safeAmount);
  state.balance.current = toMoney(state.balance.current - safeAmount);
  saveState();
  return pot;
}

export function withdrawFromPot(id, amount) {
  const pot = findById(state.pots, id, "Pot");
  const safeAmount = requireMoney(amount, "Amount");
  if (safeAmount > pot.total) throw new Error("Pot balance is insufficient.");

  pot.total = toMoney(pot.total - safeAmount);
  state.balance.current = toMoney(state.balance.current + safeAmount);
  saveState();
  return pot;
}

export function deletePot(id) {
  const pot = findById(state.pots, id, "Pot");
  state.pots = state.pots.filter((item) => item.id !== id);
  state.balance.current = toMoney(state.balance.current + pot.total);
  saveState();
  return pot;
}
