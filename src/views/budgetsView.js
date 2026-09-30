import { budgetCard } from "../components/budgetCard.js";
import { emptyState } from "../components/emptyState.js";
import { getBudgetsWithSummaries } from "../core/selectors.js";
import { escapeHtml, formatCurrency } from "../core/utils.js";
import { buildBudgetGradient, renderPage } from "./viewHelpers.js";

export function renderBudgetsView(context) {
  const budgets = getBudgetsWithSummaries(context.appState);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalLimit = budgets.reduce((sum, budget) => sum + budget.maximum, 0);
  return renderPage(context, {
    title: "Budgets",
    actions: '<button type="button" class="btn btn--primary" data-modal="budget-create">Add New Budget</button>',
    content: `<section class="budget-layout"><article class="panel budget-summary-panel"><div class="donut donut--large" style="--donut:${buildBudgetGradient(budgets)}"><strong>${formatCurrency(totalSpent, { compact: true })}</strong><span>of ${formatCurrency(totalLimit, { compact: true })} limit</span></div><div class="mini-list">${budgets.map((budget) => `<div class="mini-metric" style="--metric-color:${budget.theme}"><span>${escapeHtml(budget.category)}</span><strong>${formatCurrency(budget.spent)} of ${formatCurrency(budget.maximum)}</strong></div>`).join("") || "<p>No budgets yet.</p>"}</div></article>
      <div class="card-stack">${budgets.length ? budgets.map(budgetCard).join("") : emptyState("No budgets yet", "Create a budget to start comparing category spending with a monthly limit.")}</div></section>`
  });
}
