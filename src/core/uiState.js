// Volatile interface state stays separate from persisted finance-domain state.
const SIDEBAR_COLLAPSED_KEY = "financeSidebarCollapsed";

export const uiState = {
  modal: null,
  formError: "",
  toast: "",
  sidebarCollapsed: localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true",
  currency: {
    amount: "100",
    from: "USD",
    to: "EUR",
    currencies: null,
    loading: false,
    error: "",
    result: null
  }
};

export function openModalState(type, id = "") {
  uiState.modal = { type, id };
  uiState.formError = "";
}

export function closeModalState() {
  uiState.modal = null;
  uiState.formError = "";
}

export function setFormError(message = "") {
  uiState.formError = String(message);
}

export function setToast(message = "") {
  uiState.toast = String(message);
}

export function toggleSidebar() {
  uiState.sidebarCollapsed = !uiState.sidebarCollapsed;
  localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(uiState.sidebarCollapsed));
  return uiState.sidebarCollapsed;
}
