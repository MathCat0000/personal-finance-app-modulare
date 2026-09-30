import { toMoney } from "../core/utils.js";

// Frankfurter is keyless; keeping network code here makes it simple to mock in tests.
const FRANKFURTER_BASE_URL = "https://api.frankfurter.dev/v2";

export async function fetchCurrencies() {
  const response = await fetch(`${FRANKFURTER_BASE_URL}/currencies`);

  if (!response.ok) {
    throw new Error("Unable to load currencies.");
  }

  const currencies = await response.json();

  return Object.fromEntries(
    currencies.map((currency) => [currency.iso_code, currency.name])
  );
}

export async function convertCurrency({ amount, from, to }) {
  const url = new URL(`${FRANKFURTER_BASE_URL}/rate/${from}/${to}`);
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to convert currency right now.");
  }

  return {
    date: data.date,
    base: data.base,
    rates: {
      [to]: toMoney(amount) * data.rate
    },
    rate: data.rate
  };
}
