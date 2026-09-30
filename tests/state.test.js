import { test, assertEqual } from "./test-harness.js";
import {
  createEmptyState,
  replaceState,
  resetState,
  state
} from "../src/core/state.js";

test("createEmptyState creates a valid initial state", () => {
  const emptyState = createEmptyState();

  assertEqual(emptyState.session.loggedIn, false);
  assertEqual(emptyState.session.name, "");
  assertEqual(emptyState.session.email, "");
  assertEqual(emptyState.balance.current, 0);
  assertEqual(emptyState.transactions.length, 0);
  assertEqual(emptyState.budgets.length, 0);
  assertEqual(emptyState.pots.length, 0);
});

test("createEmptyState creates independent arrays", () => {
  const firstState = createEmptyState();
  const secondState = createEmptyState();

  firstState.transactions.push({ id: "tx-1" });

  assertEqual(secondState.transactions.length, 0);
});

test("replaceState updates state without changing its reference", () => {
  const sameReference = state;

  replaceState({
    session: {
      loggedIn: true,
      name: "Mario",
      email: "mario@example.com"
    },
    balance: {
      current: 1000,
      income: 2000,
      expenses: 1000
    },
    transactions: [{ id: "tx-1" }],
    budgets: [{ id: "budget-1" }],
    pots: [{ id: "pot-1" }]
  });

  assertEqual(state === sameReference, true);
  assertEqual(state.session.loggedIn, true);
  assertEqual(state.session.name, "Mario");
  assertEqual(state.balance.current, 1000);
  assertEqual(state.transactions.length, 1);
  assertEqual(state.budgets.length, 1);
  assertEqual(state.pots.length, 1);
});

test("replaceState uses defaults for missing sections", () => {
  replaceState({
    session: {
      name: "Mario"
    },
    transactions: [{ id: "tx-1" }]
  });

  assertEqual(state.session.loggedIn, false);
  assertEqual(state.session.name, "Mario");
  assertEqual(state.session.email, "");
  assertEqual(state.balance.current, 0);
  assertEqual(state.transactions.length, 1);
  assertEqual(state.budgets.length, 0);
  assertEqual(state.pots.length, 0);
});

test("replaceState copies arrays instead of reusing their references", () => {
  const transactions = [{ id: "tx-1" }];

  replaceState({
    transactions
  });

  assertEqual(state.transactions === transactions, false);
  assertEqual(state.transactions.length, 1);
});

test("replaceState uses empty arrays for non-array values", () => {
  replaceState({
    transactions: "non array",
    budgets: null,
    pots: {}
  });

  assertEqual(state.transactions.length, 0);
  assertEqual(state.budgets.length, 0);
  assertEqual(state.pots.length, 0);
});

test("resetState restores initial values", () => {
  state.session.loggedIn = true;
  state.session.name = "Mario";
  state.transactions.push({ id: "tx-1" });

  resetState();

  assertEqual(state.session.loggedIn, false);
  assertEqual(state.session.name, "");
  assertEqual(state.transactions.length, 0);
});
