import { pageShell } from "../components/pageShell.js";

export function renderPage(context, page) {
  return pageShell({
    ...page,
    path: context.path,
    userName: context.appState.session.name,
    sidebarCollapsed: context.uiState.sidebarCollapsed,
    toast: context.uiState.toast,
    modalHtml: context.modalHtml
  });
}

export function buildBudgetGradient(budgets) {
  if (!budgets.length) return "#F8F4F0 0deg 360deg";
  const total = budgets.reduce((sum, budget) => sum + Math.max(budget.maximum, budget.spent), 0) || 1;
  let cursor = 0;
  return budgets.map((budget) => {
    const size = (Math.max(budget.maximum, budget.spent) / total) * 360;
    const start = cursor;
    cursor += size;
    return `${budget.theme} ${start}deg ${cursor}deg`;
  }).join(", ");
}
