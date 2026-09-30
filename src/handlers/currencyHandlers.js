import { uiState } from "../core/uiState.js";
import { convertCurrency, fetchCurrencies } from "../services/currencyService.js";

export async function ensureCurrencies(render) {
  const currency = uiState.currency;
  if (currency.currencies || currency.loading || currency.error) return;
  currency.loading = true;
  render();
  try {
    currency.currencies = await fetchCurrencies();
    currency.error = "";
  } catch (error) {
    currency.error = error.message;
  } finally {
    currency.loading = false;
    render();
  }
}

export async function handleCurrencySubmit(form, render) {
  const data = new FormData(form);
  const currency = uiState.currency;
  currency.amount = String(data.get("amount") || "");
  currency.from = String(data.get("from") || "USD");
  currency.to = String(data.get("to") || "EUR");
  currency.error = "";
  currency.result = null;
  if (!Number(currency.amount) || Number(currency.amount) <= 0) {
    currency.error = "Enter an amount greater than 0.";
    render();
    return;
  }
  if (currency.from === currency.to) {
    currency.error = "Choose two different currencies.";
    render();
    return;
  }
  currency.loading = true;
  render();
  try {
    currency.result = await convertCurrency(currency);
  } catch (error) {
    currency.error = error.message;
  } finally {
    currency.loading = false;
    render();
  }
}
