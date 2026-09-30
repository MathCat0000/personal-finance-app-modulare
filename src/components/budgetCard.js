import { escapeHtml, formatCurrency } from "../core/utils.js";
import { progressBar, sectionHeader } from "./summaryCard.js";
import { transactionLine } from "./transactionLine.js";

export function budgetCard(budget) {
  return `<article class="panel budget-card" style="--accent:${budget.theme}">
    <div class="card-title-row"><h2>${escapeHtml(budget.category)}</h2><div class="button-row"><button type="button" class="btn btn--secondary btn--sm" data-modal="budget-edit" data-id="${budget.id}">Edit</button><button type="button" class="btn btn--danger btn--sm" data-modal="budget-delete" data-id="${budget.id}">Delete</button></div></div>
    <p class="muted">Maximum of ${formatCurrency(budget.maximum)}</p>
    ${progressBar(budget.percentage, budget.theme)}
    <div class="split-metrics"><div><span>Spent</span><strong>${formatCurrency(budget.spent)}</strong></div><div><span>Free</span><strong>${formatCurrency(budget.free)}</strong></div></div>
    <div class="latest-card">${sectionHeader("Latest Spending", `#/transactions?category=${encodeURIComponent(budget.category)}`, "See All")}<ul class="compact-list">${budget.latestSpending.map((transaction) => transactionLine(transaction)).join("") || "<li>No spending in this category yet.</li>"}</ul></div>
  </article>`;
}
