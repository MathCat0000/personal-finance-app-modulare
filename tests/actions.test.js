import { test, assertEqual } from "./test-harness.js";
import { STORAGE_KEY } from "../src/core/constants.js";
import { resetState, state } from "../src/core/state.js";
import {
  addMoneyToPot,
  createBudget,
  createPot,
  createTransaction,
  deleteBudget,
  deletePot,
  deleteTransaction,
  editBudget,
  editPot,
  login,
  logout,
  withdrawFromPot
} from "../src/core/actions.js";
import { saveState } from "../src/core/persistence.js";


// TEST login
test("login salva name, email e loggedIn true", () => {
  localStorage.removeItem(STORAGE_KEY);
  resetState();

  login({
    name: "Mario",
    email: "mario@example.com"
  });

  assertEqual(state.session.name, "Mario");
  assertEqual(state.session.email, "mario@example.com");
  assertEqual(state.session.loggedIn, true);

  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

  assertEqual(saved.session.name, "Mario");
  assertEqual(saved.session.email, "mario@example.com");
  assertEqual(saved.session.loggedIn, true);
});



test("login rifiuta email vuota", () => {
  localStorage.removeItem(STORAGE_KEY);
  resetState();

  let errorMessage = "";

  try {
    login({
      name: "Mario",
      email: ""
    });
  } catch (error) {
    errorMessage = error.message;
  }

  assertEqual(errorMessage, "Email is required.");
  assertEqual(state.session.loggedIn, false);
});

test("login rifiuta un indirizzo email non valido", () => {
  localStorage.removeItem(STORAGE_KEY);
  resetState();

  let errorMessage = "";
  try {
    login({ name: "Mario", email: "not-an-email" });
  } catch (error) {
    errorMessage = error.message;
  }

  assertEqual(errorMessage, "Email must be valid.");
  assertEqual(state.session.loggedIn, false);
  assertEqual(state.session.name, "");
});


test("logout svouta la sessione e salva lo stato", () => {
  localStorage.removeItem(STORAGE_KEY);
  resetState();

  login({
    name: "Mario",
    email: "mario@example.com"
  });

  logout();


  assertEqual(state.session.loggedIn, false);

  assertEqual(state.session.name, "");

  assertEqual(state.session.email, "");


  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

  assertEqual(saved.session.loggedIn, false);
  assertEqual(saved.session.name, "");
  assertEqual(saved.session.email, "");
});


test("logout funziona anche se la sessione è già vuota", () => {
  localStorage.removeItem(STORAGE_KEY);
  resetState();
  logout();
  assertEqual(state.session.loggedIn, false);
  assertEqual(state.session.name, "");
  assertEqual(state.session.email, "");
});

// TEST createTransaction


test("createTransaction crea una expense e aggiorna balance", () => {
  localStorage.removeItem(STORAGE_KEY);
  resetState();

  const transaction = createTransaction({
    name: "Rent",
    category: "Bills",
    date: "2024-08-19T00:00:00.000Z",
    amount: "500",
    type: "expense",
    recurring: true
  });

  assertEqual(transaction.name, "Rent");
  assertEqual(transaction.category, "Bills");
  assertEqual(transaction.amount, -500);
  assertEqual(transaction.recurring, true);
  assertEqual(state.transactions.length, 1);
  assertEqual(state.balance.current, -500);
  assertEqual(state.balance.expenses, 500);
});


test("createTransaction crea una income e aggiorna balance", () => {
  localStorage.removeItem(STORAGE_KEY);
  resetState();

  const transaction = createTransaction({
    name: "Salary",
    category: "General",
    date: "2024-08-19T00:00:00.000Z",
    amount: "2000",
    type: "income"
  });

  assertEqual(transaction.amount, 2000);
  assertEqual(state.balance.current, 2000);
  assertEqual(state.balance.income, 2000);
});

test("createTransaction rejects an invalid date before mutating state", () => {
  resetState();

  let errorMessage = "";
  try {
    createTransaction({ name: "Rent", category: "Bills", amount: "500", date: "not-a-date" });
  } catch (error) {
    errorMessage = error.message;
  }

  assertEqual(errorMessage, "Date must be valid.");
  assertEqual(state.transactions.length, 0);
  assertEqual(state.balance.current, 0);
});



// TEST deleteTransaction

test("deleteTransaction elimina expense e annulla effetto sul balance", () => {
  localStorage.removeItem(STORAGE_KEY);
  resetState();

  const transaction = createTransaction({
    name: "Rent",
    category: "Bills",
    amount: "500",
    type: "expense"
  });

  deleteTransaction(transaction.id);

  assertEqual(state.transactions.length, 0);
  assertEqual(state.balance.current, 0);
  assertEqual(state.balance.expenses, 0);
});


test("deleteTransaction elimina income e annulla effetto sul balance", () => {
  localStorage.removeItem(STORAGE_KEY);
  resetState();

  const transaction = createTransaction({
    name: "Salary",
    category: "General",
    amount: "2000",
    type: "income"
  });

  deleteTransaction(transaction.id);

  assertEqual(state.transactions.length, 0);
  assertEqual(state.balance.current, 0);
  assertEqual(state.balance.income, 0);
});


test("deleteTransaction salva lo stato in localStorage", () => {
  localStorage.removeItem(STORAGE_KEY);
  resetState();

  const transaction = createTransaction({
    name: "Rent",
    category: "Bills",
    amount: "500"
  });

  deleteTransaction(transaction.id);

  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

  assertEqual(saved.transactions.length, 0);
});


test("deleteTransaction lancia errore se id non esiste", () => {
  localStorage.removeItem(STORAGE_KEY);
  resetState();

  let errorMessage = "";

  try {
    deleteTransaction("missing-id");
  } catch (error) {
    errorMessage = error.message;
  }

  assertEqual(errorMessage, "Transaction not found.");
});


//TEST createBudget

test("createBudget crea un budget valido", () => {
  localStorage.removeItem(STORAGE_KEY);
  resetState();

  const budget = createBudget({
    category: "Bills",
    maximum: "600",
    theme: "#277C78"
  });

  assertEqual(budget.category, "Bills");
  assertEqual(budget.maximum, 600);
  assertEqual(budget.theme, "#277C78");
  assertEqual(state.budgets.length, 1);
});


test("createBudget salva lo stato in localStorage", () => {
  localStorage.removeItem(STORAGE_KEY);
  resetState();

  createBudget({
    category: "Bills",
    maximum: "600",
    theme: "#277C78"
  });

  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

  assertEqual(saved.budgets.length, 1);
  assertEqual(saved.budgets[0].category, "Bills");
});


test("createBudget rifiuta categoria duplicata", () => {
  localStorage.removeItem(STORAGE_KEY);
  resetState();

  createBudget({
    category: "Bills",
    maximum: "600"
  });

  let errorMessage = "";

  try {
    createBudget({
      category: "Bills",
      maximum: "800"
    });
  } catch (error) {
    errorMessage = error.message;
  }

  assertEqual(errorMessage, "Budget already exists for this category.");
  assertEqual(state.budgets.length, 1);
});

test("createBudget rifiuta maximum non valido", () => {
  localStorage.removeItem(STORAGE_KEY);
  resetState();

  let errorMessage = "";

  try {
    createBudget({
      category: "Bills",
      maximum: "abc"
    });
  } catch (error) {
    errorMessage = error.message;
  }

  assertEqual(errorMessage, "Maximum must be greater than zero.");
  assertEqual(state.budgets.length, 0);
});

test("editBudget updates the limit and keeps the category identity", () => {
  resetState();
  const budget = createBudget({ category: "Bills", maximum: "600" });

  const updated = editBudget(budget.id, { maximum: "800", theme: "#F2CDAC" });

  assertEqual(updated.category, "Bills");
  assertEqual(updated.maximum, 800);
  assertEqual(updated.theme, "#F2CDAC");
});

test("deleteBudget removes only the requested budget", () => {
  resetState();
  const first = createBudget({ category: "Bills", maximum: "600" });
  createBudget({ category: "Groceries", maximum: "400" });

  deleteBudget(first.id);

  assertEqual(state.budgets.length, 1);
  assertEqual(state.budgets[0].category, "Groceries");
});

test("pot actions preserve balance invariants across its lifecycle", () => {
  resetState();
  state.balance.current = 1000;

  const pot = createPot({ name: "Emergency Fund", target: "1500" });
  addMoneyToPot(pot.id, "250");
  assertEqual(state.pots[0].total, 250);
  assertEqual(state.balance.current, 750);

  withdrawFromPot(pot.id, "100");
  assertEqual(state.pots[0].total, 150);
  assertEqual(state.balance.current, 850);

  editPot(pot.id, { name: "Emergency Reserve", target: "2000" });
  assertEqual(state.pots[0].name, "Emergency Reserve");
  deletePot(pot.id);
  assertEqual(state.pots.length, 0);
  assertEqual(state.balance.current, 1000);
});

test("pot names are unique without case sensitivity", () => {
  resetState();
  createPot({ name: "Emergency Fund", target: "1000" });

  let errorMessage = "";
  try {
    createPot({ name: "emergency fund", target: "500" });
  } catch (error) {
    errorMessage = error.message;
  }

  assertEqual(errorMessage, "Pot name already exists.");
});

test("pot actions reject overspending and over-withdrawal", () => {
  resetState();
  state.balance.current = 100;
  const pot = createPot({ name: "Reserve", target: "200" });

  let errorMessage = "";
  try {
    addMoneyToPot(pot.id, "101");
  } catch (error) {
    errorMessage = error.message;
  }
  assertEqual(errorMessage, "Insufficient balance.");

  addMoneyToPot(pot.id, "50");
  errorMessage = "";
  try {
    withdrawFromPot(pot.id, "51");
  } catch (error) {
    errorMessage = error.message;
  }
  assertEqual(errorMessage, "Pot balance is insufficient.");
});
