import { escapeHtml, formatCurrency, formatDate } from "../core/utils.js";

export function transactionTable(transactions) {
  return `<div class="table-wrap"><table class="data-table">
    <thead><tr><th>Recipient/Sender</th><th>Category</th><th>Transaction Date</th><th>Amount</th><th><span class="sr-only">Actions</span></th></tr></thead>
    <tbody>${transactions.map((transaction) => `<tr>
      <td data-label="Recipient/Sender"><div class="table-person"><img src="${transaction.avatar}" alt="" width="40" height="40"><strong>${escapeHtml(transaction.name)}</strong></div></td>
      <td data-label="Category">${escapeHtml(transaction.category)}</td>
      <td data-label="Date"><time datetime="${transaction.date}">${formatDate(transaction.date)}</time></td>
      <td data-label="Amount" class="${transaction.amount >= 0 ? "is-positive" : "is-negative"}"><strong>${formatCurrency(transaction.amount, { signed: true })}</strong></td>
      <td data-label="Actions"><button type="button" class="icon-button danger" data-modal="transaction-delete" data-id="${transaction.id}">Delete</button></td>
    </tr>`).join("")}</tbody>
  </table></div>`;
}
