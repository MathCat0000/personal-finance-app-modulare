import { test, assertEqual } from "./test-harness.js";
import { convertCurrency, fetchCurrencies } from "../src/services/currencyService.js";

test("fetchCurrencies transforms the API response into a map", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: true, json: async () => [{ iso_code: "EUR", name: "Euro" }, { iso_code: "USD", name: "US Dollar" }] });
  try {
    const result = await fetchCurrencies();
    assertEqual(result.EUR, "Euro");
    assertEqual(result.USD, "US Dollar");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("convertCurrency applies the rate to the amount", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ date: "2024-08-19", base: "USD", quote: "EUR", rate: 0.9 }) });
  try {
    const result = await convertCurrency({ amount: 100, from: "USD", to: "EUR" });
    assertEqual(result.rates.EUR, 90);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("convertCurrency exposes the error returned by the API", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: false, json: async () => ({ message: "Unknown currency" }) });
  let message = "";
  try {
    await convertCurrency({ amount: 100, from: "XXX", to: "EUR" });
  } catch (error) {
    message = error.message;
  } finally {
    globalThis.fetch = originalFetch;
  }
  assertEqual(message, "Unknown currency");
});
