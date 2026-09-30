import { createBudget, deleteBudget, editBudget } from "../core/actions.js";

export function handleBudgetAction(type, data, id) {
  if (type === "budget-create") {
    createBudget({ category: data.get("category"), maximum: data.get("maximum"), theme: data.get("theme") });
    return "Budget added.";
  }
  if (type === "budget-edit") {
    editBudget(id, { maximum: data.get("maximum"), theme: data.get("theme") });
    return "Budget updated.";
  }
  if (type === "budget-delete") {
    deleteBudget(id);
    return "Budget deleted.";
  }
  return null;
}
