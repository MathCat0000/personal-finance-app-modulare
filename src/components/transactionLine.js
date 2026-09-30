import { escapeHtml, formatCurrency, formatDate } from "../core/utils.js";

export function transactionLine(transaction, { deletable = false } = {}) {
  const amountClass = transaction.amount >= 0 ? "is-positive" : "is-negative";
  return `<li class="transaction-line">
    <img src="${transaction.avatar}" alt="" width="40" height="40">
    <div><strong>${escapeHtml(transaction.name)}</strong><span>${escapeHtml(transaction.category)}</span></div>
    <time datetime="${transaction.date}">${formatDate(transaction.date)}</time>
    <strong class="${amountClass}">${formatCurrency(transaction.amount, { signed: true })}</strong>
    ${deletable ? `<button type="button" class="icon-button danger" data-modal="transaction-delete" data-id="${transaction.id}" aria-label="Delete ${escapeHtml(transaction.name)}">Delete</button>` : ""}
  </li>`;
}
