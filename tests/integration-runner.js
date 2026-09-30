import { readFile } from "node:fs/promises";

const store = new Map();
globalThis.localStorage = {
  getItem(key) { return store.has(key) ? store.get(key) : null; },
  setItem(key, value) { store.set(key, String(value)); },
  removeItem(key) { store.delete(key); },
  clear() { store.clear(); }
};

const appNode = { innerHTML: "" };
const documentListeners = new Map();
const windowListeners = new Map();
globalThis.document = {
  querySelector(selector) { return selector === "#app" ? appNode : null; },
  addEventListener(type, callback) { documentListeners.set(type, callback); }
};
globalThis.window = {
  location: { hash: "#/overview", href: "" },
  addEventListener(type, callback) { windowListeners.set(type, callback); }
};

globalThis.fetch = async () => ({
  ok: true,
  async json() { return [{ iso_code: "EUR", name: "Euro" }, { iso_code: "USD", name: "US Dollar" }]; }
});

const seed = JSON.parse(await readFile(new URL("../data.json", import.meta.url), "utf8"));
seed.session = { loggedIn: true, name: "Integration User", email: "integration@example.com" };
localStorage.setItem("financeAppState", JSON.stringify(seed));

const { render } = await import("../src/app.js");
const routes = [
  ["#/overview", "Overview"],
  ["#/transactions", "Add New Transaction"],
  ["#/budgets", "Add New Budget"],
  ["#/pots", "Add New Pot"],
  ["#/recurring", "Recurring Bills"],
  ["#/currency", "Currency Exchange"]
];

for (const [hash, expected] of routes) {
  window.location.hash = hash;
  render();
  if (!appNode.innerHTML.includes(expected)) {
    throw new Error(`Route ${hash} does not include ${expected}.`);
  }
  if (appNode.innerHTML.includes("undefined")) {
    throw new Error(`Route ${hash} contains the text undefined.`);
  }
  console.log(`PASS integration - ${hash}`);
}

if (!documentListeners.has("click") || !documentListeners.has("submit") || !windowListeners.has("hashchange")) {
  throw new Error("The main event listeners were not registered.");
}
console.log("PASS integration - main event listeners registered");
