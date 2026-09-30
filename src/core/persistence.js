import { DEFAULT_AVATAR, STORAGE_KEY, THEMES } from "./constants.js";
import { createEmptyState, replaceState, resetState, state } from "./state.js";
import { stableId, toMoney } from "./utils.js";

// This module is the boundary between untrusted stored/seed data and domain state.

export function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

export function readStoredState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

// Structural validation decides whether localStorage can be used instead of data.json.
export function isStoredStateValid(value) {
  return Boolean(
    value &&
      typeof value === "object" &&
      value.balance &&
      typeof value.balance === "object" &&
      Array.isArray(value.transactions) &&
      Array.isArray(value.budgets) &&
      Array.isArray(value.pots)
  );
}

export function normalizeTransaction(transaction = {}, index = 0) {
  const date = new Date(transaction.date);
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;
  return {
    id: transaction.id || stableId("transaction", transaction.name || "unknown", transaction.date || "date", transaction.amount || 0, index),
    avatar: transaction.avatar || DEFAULT_AVATAR,
    name: String(transaction.name || "Unknown"),
    category: String(transaction.category || "General"),
    date: safeDate.toISOString(),
    amount: toMoney(transaction.amount),
    recurring: Boolean(transaction.recurring)
  };
}

export function normalizeBudget(budget = {}, index = 0) {
  const category = String(budget.category || "General");
  return {
    id: budget.id || stableId("budget", category, index),
    category,
    maximum: Math.max(0, toMoney(budget.maximum)),
    theme: budget.theme || THEMES[0].value
  };
}

export function normalizePot(pot = {}, index = 0) {
  const name = String(pot.name || "Pot");
  return {
    id: pot.id || stableId("pot", name, index),
    name,
    target: Math.max(0, toMoney(pot.target)),
    total: Math.max(0, toMoney(pot.total)),
    theme: pot.theme || THEMES[0].value
  };
}

// Normalize every external value before copying it into the single source of truth.
export function applyState(nextState = {}) {
  const emptyState = createEmptyState();
  const balance = nextState.balance || emptyState.balance;
  return replaceState({
    session: {
      ...emptyState.session,
      ...(nextState.session || {}),
      loggedIn: Boolean(nextState.session?.loggedIn)
    },
    balance: {
      current: toMoney(balance.current),
      income: Math.max(0, toMoney(balance.income)),
      expenses: Math.max(0, toMoney(balance.expenses))
    },
    transactions: Array.isArray(nextState.transactions) ? nextState.transactions.map(normalizeTransaction) : [],
    budgets: Array.isArray(nextState.budgets) ? nextState.budgets.map(normalizeBudget) : [],
    pots: Array.isArray(nextState.pots) ? nextState.pots.map(normalizePot) : []
  });
}

export async function initState() {
  const storedState = readStoredState();
  if (isStoredStateValid(storedState)) {
    applyState(storedState);
    saveState();
    return state;
  }
  // data.json is the deterministic first-run seed; later visits use localStorage.
  const response = await fetch("./data.json");
  if (!response.ok) throw new Error("Unable to load initial data.");
  const data = await response.json();
  const emptyState = createEmptyState();
  applyState({
    ...emptyState,
    session: storedState?.session || emptyState.session,
    balance: data.balance,
    transactions: data.transactions,
    budgets: data.budgets,
    pots: data.pots
  });
  saveState();
  return state;
}

export function resetAppData() {
  localStorage.removeItem(STORAGE_KEY);
  return resetState();
}
