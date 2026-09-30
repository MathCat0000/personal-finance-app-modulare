import { emptyState } from "../components/emptyState.js";
import { optionList } from "../components/formControls.js";
import { paginationControls } from "../components/paginationControls.js";
import { BILL_SORTS } from "../core/constants.js";
import { getRecurringBills, getRecurringSummary } from "../core/selectors.js";
import { escapeHtml, formatBillDate, formatCurrency, normalizePage } from "../core/utils.js";
import { renderPage } from "./viewHelpers.js";

function recurringTable(bills) {
  return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Vendor</th><th>Bill Date</th><th>Status</th><th>Amount</th></tr></thead><tbody>${bills.map((bill) => `<tr>
    <td data-label="Vendor"><div class="table-person"><img src="${bill.avatar}" alt="" width="40" height="40"><strong>${escapeHtml(bill.vendor)}</strong></div></td>
    <td data-label="Bill Date">${formatBillDate(bill.dueDay)}</td>
    <td data-label="Status"><span class="status-pill status-${bill.status}">${bill.status === "dueSoon" ? "Due Soon" : bill.status}</span></td>
    <td data-label="Amount"><strong>${formatCurrency(bill.amount)}</strong></td>
  </tr>`).join("")}</tbody></table></div>`;
}

export function renderRecurringView(context) {
  const query = { search: context.params.search || "", sort: context.params.sort || "latest", page: normalizePage(context.params.page) };
  const result = getRecurringBills(context.appState, query);
  const summary = getRecurringSummary(context.appState);
  return renderPage(context, {
    title: "Recurring Bills",
    content: `<section class="recurring-layout">
      <article class="summary-card summary-card--dark total-bills"><span>Total Bills</span><strong>${formatCurrency(summary.total)}</strong></article>
      <article class="panel bill-breakdown"><h2>Summary</h2><div><span>Paid Bills (${summary.paidCount})</span><strong>${formatCurrency(summary.paid)}</strong></div><div><span>Total Upcoming (${summary.upcomingCount})</span><strong>${formatCurrency(summary.upcoming)}</strong></div><div class="danger-text"><span>Due Soon (${summary.dueSoonCount})</span><strong>${formatCurrency(summary.dueSoon)}</strong></div></article>
      <article class="panel recurring-table-panel"><form class="toolbar" data-filter-form="recurring"><label class="search-field"><span class="sr-only">Search bills</span><input type="search" name="search" placeholder="Search bills" value="${escapeHtml(query.search)}"></label><label><span>Sort by</span><select name="sort">${optionList(BILL_SORTS, query.sort)}</select></label><button class="btn btn--secondary" type="submit">Apply</button></form>
      ${result.totalItems ? `${recurringTable(result.items)}${paginationControls(result, "recurring")}` : emptyState("No bills found", "Try another vendor name or reset your search.")}</article>
    </section>`
  });
}
