import { emptyState } from "../components/emptyState.js";
import { optionList, selected } from "../components/formControls.js";
import { paginationControls } from "../components/paginationControls.js";
import { transactionTable } from "../components/transactionTable.js";
import { CATEGORIES, TRANSACTION_SORTS } from "../core/constants.js";
import { getFilteredTransactions } from "../core/selectors.js";
import { escapeHtml, normalizePage } from "../core/utils.js";
import { renderPage } from "./viewHelpers.js";

export function renderTransactionsView(context) {
  const params = context.params;
  const query = { search: params.search || "", category: params.category || "all", sort: params.sort || "latest", page: normalizePage(params.page) };
  const result = getFilteredTransactions(context.appState, query);
  return renderPage(context, {
    title: "Transactions",
    actions: '<button type="button" class="btn btn--primary" data-modal="transaction-create">Add New Transaction</button>',
    content: `<section class="panel"><form class="toolbar" data-filter-form="transactions">
      <label class="search-field"><span class="sr-only">Search transactions</span><input type="search" name="search" placeholder="Search transactions" value="${escapeHtml(query.search)}"></label>
      <label><span>Sort by</span><select name="sort">${optionList(TRANSACTION_SORTS, query.sort)}</select></label>
      <label><span>Category</span><select name="category"><option value="all" ${selected(query.category, "all")}>All Transactions</option>${optionList(CATEGORIES, query.category)}</select></label>
      <button class="btn btn--secondary" type="submit">Apply</button></form>
      ${result.totalItems ? `${transactionTable(result.items)}${paginationControls(result, "transactions")}` : emptyState("No transactions found", "Try adjusting your search or filters.")}
    </section>`
  });
}
