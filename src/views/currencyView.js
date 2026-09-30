import { optionList } from "../components/formControls.js";
import { escapeHtml } from "../core/utils.js";
import { renderPage } from "./viewHelpers.js";

function formatConverted(result, code) {
  const value = result?.rates?.[code];
  if (value === undefined) return "0.00";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(value);
}

export function renderCurrencyView(context) {
  const currency = context.uiState.currency;
  const options = currency.currencies
    ? Object.entries(currency.currencies).map(([code, name]) => ({ value: code, label: `${code} - ${name}` }))
    : [{ value: "USD", label: "USD" }, { value: "EUR", label: "EUR" }, { value: "GBP", label: "GBP" }];
  return renderPage(context, {
    title: "Currency Exchange",
    content: `<section class="currency-layout"><article class="panel currency-card"><p class="muted">Live rates are loaded from Frankfurter when the network is available.</p>
      <form class="currency-form" data-currency-form><label><span>Amount</span><input name="amount" type="number" min="0.01" step="0.01" value="${escapeHtml(currency.amount)}" required></label><label><span>From</span><select name="from">${optionList(options, currency.from)}</select></label><label><span>To</span><select name="to">${optionList(options, currency.to)}</select></label><button class="btn btn--primary" type="submit" ${currency.loading ? "disabled" : ""}>${currency.loading ? "Converting..." : "Convert"}</button></form>
      ${currency.error ? `<p class="form-error" role="alert">${escapeHtml(currency.error)}</p><button class="btn btn--secondary" type="button" data-action="currency-retry">Retry currencies</button>` : ""}
      ${currency.result ? `<div class="conversion-result"><span>${escapeHtml(currency.amount)} ${escapeHtml(currency.from)} equals</span><strong>${formatConverted(currency.result, currency.to)} ${escapeHtml(currency.to)}</strong><p>Rate date: ${escapeHtml(currency.result.date)}</p></div>` : ""}
    </article></section>`
  });
}
