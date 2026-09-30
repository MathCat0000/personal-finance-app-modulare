import { renderModal } from "./components/modal.js";
import { initState } from "./core/persistence.js";
import { state } from "./core/state.js";
import { uiState } from "./core/uiState.js";
import { bindAppHandlers } from "./handlers/appHandlers.js";
import { ensureCurrencies } from "./handlers/currencyHandlers.js";
import { currentPath, DEFAULT_ROUTE, parseHashParams } from "./router/router.js";
import { renderBudgetsView } from "./views/budgetsView.js";
import { renderCurrencyView } from "./views/currencyView.js";
import { renderOverviewView } from "./views/overviewView.js";
import { renderPotsView } from "./views/potsView.js";
import { renderRecurringView } from "./views/recurringView.js";
import { renderTransactionsView } from "./views/transactionsView.js";
import { escapeHtml } from "./core/utils.js";

const app = document.querySelector("#app");
// The route map is the only place that connects URL paths to complete page views.
const routes = new Map([
  ["#/overview", renderOverviewView],
  ["#/transactions", renderTransactionsView],
  ["#/budgets", renderBudgetsView],
  ["#/pots", renderPotsView],
  ["#/recurring", renderRecurringView],
  ["#/currency", renderCurrencyView]
]);

// Rendering is deterministic: current state + UI state + URL produce the page HTML.
export function render() {
  const path = currentPath();
  const rawPath = window.location.hash.split("?")[0];
  if (rawPath !== path) {
    window.location.hash = DEFAULT_ROUTE;
    return;
  }

  const view = routes.get(path);
  app.innerHTML = view({
    appState: state,
    uiState,
    path,
    params: parseHashParams(),
    modalHtml: renderModal(state, uiState)
  });

  if (path === "#/currency") void ensureCurrencies(render);
}

bindAppHandlers(render);

try {
  await initState();
  if (!state.session.loggedIn) {
    window.location.href = "index.html";
  } else {
    if (!window.location.hash) window.location.hash = DEFAULT_ROUTE;
    render();
  }
} catch (error) {
  app.innerHTML = `<main class="error-boot"><h1>Unable to start the app</h1><p>${escapeHtml(error.message)}</p><a class="btn btn--primary" href="index.html">Back to landing</a></main>`;
}
