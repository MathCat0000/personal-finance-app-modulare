import { createTransaction, deleteTransaction } from "../core/actions.js";

export function handleTransactionAction(type, data, id) {
  if (type === "transaction-create") {
    createTransaction({
      name: data.get("name"),
      category: data.get("category"),
      date: data.get("date"),
      amount: data.get("amount"),
      type: data.get("type"),
      recurring: data.get("recurring") === "on"
    });
    return "Transaction added.";
  }
  if (type === "transaction-delete") {
    deleteTransaction(id);
    return "Transaction deleted.";
  }
  return null;
}
