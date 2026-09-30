import { test, assertEqual } from "./test-harness.js";
import { replaceState, resetState, state } from "../src/core/state.js";
import { STORAGE_KEY } from "../src/core/constants.js";
import {
  applyState,
  initState,
  normalizeBudget,
  normalizePot,
  normalizeTransaction,
  readStoredState,
  resetAppData,
  saveState
} from "../src/core/persistence.js";

test("saveState writes state to localStorage", () => {
  localStorage.removeItem(STORAGE_KEY);
  resetState();

  // Arrange data
  // Act
  // Assert the result

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
    transactions: [{ id: "tx-1" }]
  });

  saveState();

  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

  assertEqual(saved.session.name, "Mario");
  assertEqual(saved.balance.current, 1000);
  assertEqual(saved.transactions.length, 1);
});



// TEST readStoredState


test("readStoredState reads state from localStorage", () => {
  localStorage.removeItem(STORAGE_KEY);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      session: {
        loggedIn: true,
        name: "Mario",
        email: "mario@example.com"
      },
      balance: {
        current: 500,
        income: 700,
        expenses: 200
      },
      transactions: [],
      budgets: [],
      pots: []
    })
  );

  const stored = readStoredState();

  assertEqual(stored.session.name, "Mario");
  assertEqual(stored.balance.current, 500);
});


test("readStoredState returns null when localStorage is empty", () => {
  localStorage.removeItem(STORAGE_KEY);

  const stored = readStoredState();

  assertEqual(stored, null);
});


test("readStoredState returns null for malformed JSON", () => {
  localStorage.setItem(STORAGE_KEY, "{json rotto");

  const stored = readStoredState();

  assertEqual(stored, null);
});


// TEST normalizeTransaction

test("normalizeTransaction normalizes a valid transaction", () => {
  const transaction = normalizeTransaction(
    {
      name: "Rent",
      category: "Bills",
      date: "2024-08-19T00:00:00.000Z",
      amount: "-500.129",
      recurring: true
    },
    0
  );

  assertEqual(transaction.name, "Rent");
  assertEqual(transaction.category, "Bills");
  assertEqual(transaction.date, "2024-08-19T00:00:00.000Z");
  assertEqual(transaction.amount, -500.13);
  assertEqual(transaction.recurring, true);
});


test("normalizeTransaction uses fallbacks for missing fields", () => {
  const transaction = normalizeTransaction({}, 0);

  assertEqual(transaction.avatar.endsWith("urban-services-hub.jpg"), true);
  assertEqual(transaction.name, "Unknown");
  assertEqual(transaction.category, "General");
  assertEqual(transaction.amount, 0);
  assertEqual(transaction.recurring, false);
});



test("normalizeTransaction generates a stable id when it is missing", () => {
  const first = normalizeTransaction(
    {
      name: "Rent",
      date: "2024-08-19T00:00:00.000Z",
      amount: -500
    },
    0
  );

  const second = normalizeTransaction(
    {
      name: "Rent",
      date: "2024-08-19T00:00:00.000Z",
      amount: -500
    },
    0
  );

  assertEqual(first.id, second.id);
});


//TEST normalizeBudget


test("normalizeBudget normalizes a valid budget", () => {
  const budget = normalizeBudget(
    {
      category: "Entertainment",
      maximum: "500.129",
      theme: "#277C78"
    },
    0
  );

  assertEqual(budget.category, "Entertainment");
  assertEqual(budget.maximum, 500.13);
  assertEqual(budget.theme, "#277C78");
});


test("normalizeBudget uses fallbacks for missing fields", () => {
  const budget = normalizeBudget({}, 0);

  assertEqual(budget.category, "General");
  assertEqual(budget.maximum, 0);
  assertEqual(budget.theme, "#277C78");
  assertEqual(budget.id.startsWith("budget-"), true);
});



// TEST normalizePot


test("normalizePot normalizes a valid pot", () => {
  const pot = normalizePot(
    {
      name: "Savings",
      target: "1000.129",
      total: "250.555",
      theme: "#277C78"
    },
    0
  );

  assertEqual(pot.name, "Savings");
  assertEqual(pot.target, 1000.13);
  assertEqual(pot.total, 250.56);
  assertEqual(pot.theme, "#277C78");
});


test("normalizePot uses fallbacks for missing fields", () => {
  const pot = normalizePot({}, 0);

  assertEqual(pot.name, "Pot");
  assertEqual(pot.target, 0);
  assertEqual(pot.total, 0);
  assertEqual(pot.theme, "#277C78");
  assertEqual(pot.id.startsWith("pot-"), true);
});


// TEST applyState


test("applyState normalizes and copies data into central state", () => {
  applyState({
    session: {
      loggedIn: true,
      name: "Mario",
      email: "mario@example.com"
    },
    balance: {
      current: "1000",
      income: "2000",
      expenses: "1000"
    },
    transactions: [
      {
        name: "Rent",
        category: "Bills",
        date: "2024-08-19T00:00:00.000Z",
        amount: "-500.129",
        recurring: true
      }
    ],
    budgets: [
      {
        category: "Bills",
        maximum: "600.129"
      }
    ],
    pots: [
      {
        name: "Savings",
        target: "1000.129",
        total: "250.555"
      }
    ]
  });

  assertEqual(state.session.loggedIn, true);
  assertEqual(state.session.name, "Mario");
  assertEqual(state.transactions.length, 1);
  assertEqual(state.transactions[0].amount, -500.13);
  assertEqual(state.budgets[0].maximum, 600.13);
  assertEqual(state.pots[0].total, 250.56);
});



test("applyState handles partial state", () => {
  localStorage.removeItem(STORAGE_KEY);
  resetState();

  applyState({
    balance: {
      current: 100
    }
  });

  assertEqual(state.session.loggedIn, false);
  assertEqual(state.balance.current, 100);
  assertEqual(state.balance.income, 0);
  assertEqual(state.balance.expenses, 0);
  assertEqual(state.transactions.length, 0);
  assertEqual(state.budgets.length, 0);
  assertEqual(state.pots.length, 0);
});

test("applyState uses an empty balance when balance is missing", () => {
  resetState();

  applyState({
    session: {
      loggedIn: true,
      name: "Mario",
      email: "mario@example.com"
    }
  });

  assertEqual(state.session.loggedIn, true);
  assertEqual(state.balance.current, 0);
  assertEqual(state.balance.income, 0);
  assertEqual(state.balance.expenses, 0);
});

test("applyState uses empty arrays when collections are missing", () => {
  resetState();

  applyState({
    session: {
      name: "Mario"
    }
  });

  assertEqual(state.transactions.length, 0);
  assertEqual(state.budgets.length, 0);
  assertEqual(state.pots.length, 0);
});

test("applyState does not save to localStorage automatically", () => {
  localStorage.removeItem(STORAGE_KEY);
  resetState();

  applyState({
    transactions: [
      {
        name: "Rent",
        date: "2024-08-19T00:00:00.000Z",
        amount: -500
      }
    ]
  });

  assertEqual(localStorage.getItem(STORAGE_KEY), null);
});



// TEST initState

test("initState uses valid stored state when available", async () => {
  localStorage.removeItem(STORAGE_KEY);
  resetState();

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      session: {
        loggedIn: true,
        name: "Mario",
        email: "mario@example.com"
      },
      balance: {
        current: 500,
        income: 700,
        expenses: 200
      },
      transactions: [
        {
          name: "Rent",
          category: "Bills",
          date: "2024-08-19T00:00:00.000Z",
          amount: "-500.129"
        }
      ],
      budgets: [],
      pots: []
    })
  );

  const originalFetch = globalThis.fetch;
  globalThis.fetch = () => {
    throw new Error("fetch should not be called");
  };

  try {
    await initState();
  } finally {
    globalThis.fetch = originalFetch;
  }

  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

  assertEqual(state.session.name, "Mario");
  assertEqual(state.transactions[0].amount, -500.13);
  assertEqual(saved.transactions[0].amount, -500.13);
});

test("initState loads data.json when localStorage is empty", async () => {
  localStorage.removeItem(STORAGE_KEY);
  resetState();

  let requestedUrl = "";
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (url) => {
    requestedUrl = String(url);

    return {
      ok: true,
      async json() {
        return {
          balance: {
            current: "1000",
            income: "2000",
            expenses: "1000"
          },
          transactions: [
            {
              name: "Salary",
              category: "General",
              date: "2024-08-19T00:00:00.000Z",
              amount: "2000"
            }
          ],
          budgets: [
            {
              category: "Bills",
              maximum: "600.129"
            }
          ],
          pots: [
            {
              name: "Savings",
              target: "1000.129",
              total: "250.555"
            }
          ]
        };
      }
    };
  };

  try {
    await initState();
  } finally {
    globalThis.fetch = originalFetch;
  }

  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

  assertEqual(requestedUrl, "./data.json");
  assertEqual(state.session.loggedIn, false);
  assertEqual(state.transactions.length, 1);
  assertEqual(state.transactions[0].amount, 2000);
  assertEqual(state.budgets[0].maximum, 600.13);
  assertEqual(state.pots[0].total, 250.56);
  assertEqual(saved.transactions.length, 1);
});

test("initState throws when data.json cannot be loaded", async () => {
  localStorage.removeItem(STORAGE_KEY);
  resetState();

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: false,
    async json() {
      return {};
    }
  });

  let errorMessage = "";

  try {
    await initState();
  } catch (error) {
    errorMessage = error.message;
  } finally {
    globalThis.fetch = originalFetch;
  }

  assertEqual(errorMessage, "Unable to load initial data.");
});



// TEST resetAppData



test("resetAppData clears localStorage and resets state", () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ demo: true }));

  applyState({
    session: {
      loggedIn: true,
      name: "Mario",
      email: "mario@example.com"
    },
    transactions: [
      {
        name: "Rent",
        date: "2024-08-19T00:00:00.000Z",
        amount: -500
      }
    ]
  });

  resetAppData();

  assertEqual(localStorage.getItem(STORAGE_KEY), null);
  assertEqual(state.session.loggedIn, false);
  assertEqual(state.session.name, "");
  assertEqual(state.transactions.length, 0);
});


test("resetAppData works when localStorage is already empty", () => {
  localStorage.removeItem(STORAGE_KEY);

  resetAppData();

  assertEqual(localStorage.getItem(STORAGE_KEY), null);
  assertEqual(state.session.loggedIn, false);
});