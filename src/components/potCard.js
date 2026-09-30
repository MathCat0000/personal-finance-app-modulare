import { escapeHtml, formatCurrency } from "../core/utils.js";
import { progressBar } from "./summaryCard.js";

export function potCard(pot) {
  return `<article class="panel pot-card" style="--accent:${pot.theme}">
    <div class="card-title-row"><h2>${escapeHtml(pot.name)}</h2><div class="button-row"><button type="button" class="btn btn--secondary btn--sm" data-modal="pot-edit" data-id="${pot.id}">Edit</button><button type="button" class="btn btn--danger btn--sm" data-modal="pot-delete" data-id="${pot.id}">Delete</button></div></div>
    <div class="pot-balance-row"><span>Total Saved</span><strong>${formatCurrency(pot.total)}</strong></div>
    ${progressBar(pot.percentage, pot.theme)}
    <div class="pot-target-row"><strong>${pot.percentage}%</strong><span>Target of ${formatCurrency(pot.target)}</span></div>
    <div class="button-grid"><button type="button" class="btn btn--secondary" data-modal="pot-add" data-id="${pot.id}">Add Money</button><button type="button" class="btn btn--secondary" data-modal="pot-withdraw" data-id="${pot.id}">Withdraw</button></div>
  </article>`;
}
