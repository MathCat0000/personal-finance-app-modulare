import { handleBudgetAction } from "./budgetHandlers.js";
import { handlePotAction } from "./potHandlers.js";
import { handleTransactionAction } from "./transactionHandlers.js";

export function handleModalForm(form) {
  const data = new FormData(form);
  const type = form.dataset.modalForm;
  const id = form.dataset.id;
  const message = handleTransactionAction(type, data, id)
    || handleBudgetAction(type, data, id)
    || handlePotAction(type, data, id);
  if (!message) throw new Error("Unknown action.");
  return message;
}
