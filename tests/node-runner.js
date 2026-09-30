const store = new Map();
globalThis.localStorage = {
  getItem(key) { return store.has(key) ? store.get(key) : null; },
  setItem(key, value) { store.set(key, String(value)); },
  removeItem(key) { store.delete(key); },
  clear() { store.clear(); }
};
globalThis.window = { location: { hash: "" } };
let html = "";
globalThis.document = {
  querySelector(selector) {
    if (selector !== "#test-results") return null;
    return {
      set innerHTML(value) { html = value; },
      get innerHTML() { return html; }
    };
  }
};

await import("./run.js");
const lines = html.replaceAll("</p>", "\n").replace(/<[^>]+>/g, "").trim();
console.log(lines);
if (html.includes("FAIL -")) process.exitCode = 1;
