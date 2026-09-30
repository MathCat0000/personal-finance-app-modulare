import { sectionHeader, summaryCard } from "../components/summaryCard.js";
import { transactionLine } from "../components/transactionLine.js";
import { getOverviewData } from "../core/selectors.js";
import { escapeHtml, formatCurrency } from "../core/utils.js";
import { buildBudgetGradient, renderPage } from "./viewHelpers.js";

export function renderOverviewView(context) {
  const data = getOverviewData(context.appState);
  const totalSaved = data.pots.reduce((sum, pot) => sum + pot.total, 0);
  const budgetGradient = buildBudgetGradient(data.budgets);
  return renderPage(context, {
    title: "Overview",
    content: `<section class="summary-grid" aria-label="Balance summary">
      ${summaryCard("Current Balance", formatCurrency(data.balance), "summary-card--dark")}
      ${summaryCard("Income", formatCurrency(data.income))}
      ${summaryCard("Expenses", formatCurrency(data.expenses))}
    </section>
    <section class="dashboard-grid">
      <article class="panel panel--wide">${sectionHeader("Pots", "#/pots")}<div class="pot-overview"><div class="pot-total"><img src="./assets/images/icon-pot.svg" alt="" aria-hidden="true" width="40" height="40"><span>Total Saved</span><strong>${formatCurrency(totalSaved)}</strong></div><div class="mini-list">${data.pots.slice(0, 4).map((pot) => `<div class="mini-metric" style="--metric-color:${pot.theme}"><span>${escapeHtml(pot.name)}</span><strong>${formatCurrency(pot.total)}</strong></div>`).join("") || "<p>No pots yet.</p>"}</div></div></article>
      <article class="panel">${sectionHeader("Budgets", "#/budgets")}<div class="budget-overview"><div class="donut" style="--donut:${budgetGradient}"><strong>${formatCurrency(data.budgets.reduce((sum, budget) => sum + budget.spent, 0), { compact: true })}</strong><span>spent</span></div><div class="mini-list">${data.budgets.slice(0, 4).map((budget) => `<div class="mini-metric" style="--metric-color:${budget.theme}"><span>${escapeHtml(budget.category)}</span><strong>${formatCurrency(budget.spent)}</strong></div>`).join("") || "<p>No budgets yet.</p>"}</div></div></article>
      <article class="panel panel--wide">${sectionHeader("Transactions", "#/transactions", "View All")}<ul class="transaction-list">${data.recentTransactions.map((transaction) => transactionLine(transaction)).join("")}</ul></article>
      <article class="panel">${sectionHeader("Recurring Bills", "#/recurring")}<div class="bill-summary-list"><div style="--metric-color:#277C78"><span>Paid Bills</span><strong>${formatCurrency(data.recurring.paid)}</strong></div><div style="--metric-color:#F2CDAC"><span>Total Upcoming</span><strong>${formatCurrency(data.recurring.upcoming)}</strong></div><div style="--metric-color:#82C9D7"><span>Due Soon</span><strong>${formatCurrency(data.recurring.dueSoon)}</strong></div></div></article>
    </section>`
  });
}
