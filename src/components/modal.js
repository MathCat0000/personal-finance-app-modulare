import { CATEGORIES, MAX_POT_NAME_LENGTH, THEMES } from "../core/constants.js";
import { getAvailableCategories } from "../core/selectors.js";
import { escapeHtml, formatCurrency, getContextDate } from "../core/utils.js";
import { calendarMonthIso, formatPickerDate, renderCalendar } from "./calendar.js";
import { optionList, themeOptions } from "./formControls.js";

function errorHtml(uiState) {
  return uiState.formError ? `<p class="form-error" role="alert">${escapeHtml(uiState.formError)}</p>` : "";
}

function confirmModal(title, body, formType, id, uiState) {
  return `<h2 id="modal-title">${title}</h2><p class="muted">${escapeHtml(body)}</p>${errorHtml(uiState)}
    <form class="modal-form" data-modal-form="${formType}" data-id="${id}"><button class="btn btn--danger" type="submit">Yes, Confirm</button><button class="btn btn--secondary" type="button" data-close-modal>No, Go Back</button></form>`;
}

function transactionModal(mode, id, appState, uiState) {
  if (mode === "delete") {
    const transaction = appState.transactions.find((item) => item.id === id);
    return confirmModal("Delete Transaction", `Delete "${transaction?.name || "this transaction"}"? This will reverse its balance effect.`, "transaction-delete", id, uiState);
  }
  const contextDate = getContextDate(appState.transactions).toISOString().slice(0, 10);
  return `<h2 id="modal-title">Add New Transaction</h2><p class="muted">Add income or spending to the ledger. The current balance updates immediately.</p>${errorHtml(uiState)}
    <form class="modal-form" data-modal-form="transaction-create">
      <label><span>Transaction Name</span><input name="name" type="text" required></label>
      <div class="calendar-field" data-calendar data-month="${calendarMonthIso(contextDate)}" data-selected="${contextDate}">
        <span class="field-label" id="transaction-date-label">Transaction Date</span><input name="date" type="hidden" value="${contextDate}" required data-calendar-input>
        <button type="button" class="calendar-trigger" data-calendar-toggle aria-labelledby="transaction-date-label" aria-expanded="false"><span data-calendar-label>${formatPickerDate(contextDate)}</span></button>
        <div class="calendar-popover" data-calendar-popover hidden>${renderCalendar(calendarMonthIso(contextDate), contextDate)}</div>
      </div>
      <label><span>Category</span><select name="category">${optionList(CATEGORIES, "General")}</select></label>
      <label><span>Amount</span><input name="amount" type="number" min="0.01" step="0.01" required></label>
      <label><span>Type</span><select name="type"><option value="expense">Spending</option><option value="income">Income</option></select></label>
      <label class="check-field"><input name="recurring" type="checkbox"><span>Recurring monthly bill</span></label>
      <button class="btn btn--primary" type="submit">Add Transaction</button>
    </form>`;
}

function budgetModal(mode, id, appState, uiState) {
  const isEdit = mode === "edit";
  const budget = isEdit ? appState.budgets.find((item) => item.id === id) : null;
  if (mode === "delete") {
    const selected = appState.budgets.find((item) => item.id === id);
    return confirmModal("Delete Budget", `Delete the "${selected?.category || "selected"}" budget? Transactions remain untouched.`, "budget-delete", id, uiState);
  }
  const categories = getAvailableCategories(appState, budget?.category);
  return `<h2 id="modal-title">${isEdit ? "Edit Budget" : "Add New Budget"}</h2><p class="muted">${isEdit ? "Update the limit and theme for this category." : "Choose a category and set a monthly spending limit."}</p>${errorHtml(uiState)}
    <form class="modal-form" data-modal-form="${isEdit ? "budget-edit" : "budget-create"}" data-id="${id || ""}">
      <label><span>Budget Category</span><select name="category" ${isEdit ? "disabled" : ""}>${optionList(categories, budget?.category || categories[0])}</select></label>
      <label><span>Maximum Spend</span><input name="maximum" type="number" min="0.01" step="0.01" value="${budget?.maximum || ""}" required></label>
      <label><span>Theme</span><select name="theme">${themeOptions(budget?.theme || THEMES[0].value)}</select></label>
      <button class="btn btn--primary" type="submit">${isEdit ? "Save Changes" : "Add Budget"}</button>
    </form>`;
}

function potModal(mode, id, appState, uiState) {
  const pot = id ? appState.pots.find((item) => item.id === id) : null;
  if (mode === "delete") return confirmModal("Delete Pot", `Delete "${pot?.name || "this pot"}"? Its saved total returns to your current balance.`, "pot-delete", id, uiState);
  if (mode === "add" || mode === "withdraw") {
    const isAdd = mode === "add";
    return `<h2 id="modal-title">${isAdd ? "Add to" : "Withdraw from"} "${escapeHtml(pot?.name || "Pot")}"</h2><p class="muted">${isAdd ? `Available balance: ${formatCurrency(appState.balance.current)}` : `Saved in pot: ${formatCurrency(pot?.total || 0)}`}</p>${errorHtml(uiState)}
      <form class="modal-form" data-modal-form="${isAdd ? "pot-add" : "pot-withdraw"}" data-id="${id}"><label><span>Amount</span><input name="amount" type="number" min="0.01" step="0.01" required></label><button class="btn btn--primary" type="submit">${isAdd ? "Confirm Addition" : "Confirm Withdrawal"}</button></form>`;
  }
  const isEdit = mode === "edit";
  return `<h2 id="modal-title">${isEdit ? "Edit Pot" : "Add New Pot"}</h2><p class="muted">Create a pot to keep savings targets separate from day-to-day spending.</p>${errorHtml(uiState)}
    <form class="modal-form" data-modal-form="${isEdit ? "pot-edit" : "pot-create"}" data-id="${id || ""}">
      <label><span>Pot Name</span><input name="name" type="text" maxlength="${MAX_POT_NAME_LENGTH}" value="${escapeHtml(pot?.name || "")}" required data-count-source><small><span data-count-target>${(pot?.name || "").length}</span> of ${MAX_POT_NAME_LENGTH} characters used</small></label>
      <label><span>Target</span><input name="target" type="number" min="0.01" step="0.01" value="${pot?.target || ""}" required></label>
      <label><span>Theme</span><select name="theme">${themeOptions(pot?.theme || THEMES[0].value)}</select></label>
      <button class="btn btn--primary" type="submit">${isEdit ? "Save Changes" : "Add Pot"}</button>
    </form>`;
}

// Modal type follows "domain-mode", for example "pot-withdraw".
export function renderModal(appState, uiState) {
  if (!uiState.modal) return "";
  const [domain, mode] = uiState.modal.type.split("-");
  const id = uiState.modal.id;
  let content = "";
  if (domain === "transaction") content = transactionModal(mode, id, appState, uiState);
  if (domain === "budget") content = budgetModal(mode, id, appState, uiState);
  if (domain === "pot") content = potModal(mode, id, appState, uiState);
  return `<div class="modal-backdrop" data-close-modal><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1"><button type="button" class="modal-close" data-close-modal aria-label="Close modal"><img src="./assets/images/icon-close-modal.svg" alt="" width="16" height="16"></button>${content}</section></div>`;
}
