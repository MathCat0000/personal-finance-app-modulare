import { test, assertEqual, assertDeepEqual } from "./test-harness.js";
import {
  getAvailableCategories,
  getBudgetSummary,
  getExpenses,
  getFilteredTransactions,
  getIncome,
  getRecurringSummary,
  paginate
} from "../src/core/selectors.js";

const transactions = [
  { id: "1", name: "Salary", category: "General", amount: 2000, date: "2024-08-19T00:00:00Z", recurring: false },
  { id: "2", name: "Rent", category: "Bills", amount: -600, date: "2024-08-18T00:00:00Z", recurring: true },
  { id: "3", name: "Cinema", category: "Entertainment", amount: -40, date: "2024-08-17T00:00:00Z", recurring: false }
];
const appState = { balance: { current: 1360 }, transactions, budgets: [{ id: "b1", category: "Bills", maximum: 800, theme: "#277C78" }], pots: [] };

test("getIncome and getExpenses derive totals from transactions", () => {
  assertEqual(getIncome(appState), 2000);
  assertEqual(getExpenses(appState), 640);
});

test("paginate limits the page and does not mutate the array", () => {
  const source = [1, 2, 3, 4, 5];
  const result = paginate(source, 2, 2);
  assertDeepEqual(result.items, [3, 4]);
  assertEqual(result.totalPages, 3);
  assertDeepEqual(source, [1, 2, 3, 4, 5]);
});

test("getFilteredTransactions searches, filters, and sorts", () => {
  const result = getFilteredTransactions(appState, { search: "re", category: "Bills", sort: "latest" });
  assertEqual(result.totalItems, 1);
  assertEqual(result.items[0].name, "Rent");
});

test("getBudgetSummary calculates spent, remaining, and percentage", () => {
  const summary = getBudgetSummary(appState, appState.budgets[0]);
  assertEqual(summary.spent, 600);
  assertEqual(summary.free, 200);
  assertEqual(summary.percentage, 75);
});

test("getAvailableCategories excludes categories already in use", () => {
  assertEqual(getAvailableCategories(appState).includes("Bills"), false);
  assertEqual(getAvailableCategories(appState, "Bills").includes("Bills"), true);
});

test("getAvailableCategories treats category identity case-insensitively", () => {
  const stateWithLegacyCase = { ...appState, budgets: [{ ...appState.budgets[0], category: "bills" }] };
  assertEqual(getAvailableCategories(stateWithLegacyCase).includes("Bills"), false);
  assertEqual(getAvailableCategories(stateWithLegacyCase, "bills").includes("Bills"), true);
});

test("getRecurringSummary groups recurring vendors", () => {
  const summary = getRecurringSummary(appState);
  assertEqual(summary.total, 600);
  assertEqual(summary.paidCount, 1);
});
