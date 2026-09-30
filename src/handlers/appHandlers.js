import { logout } from "../core/actions.js";
import {
  closeModalState,
  openModalState,
  setFormError,
  setToast,
  toggleSidebar,
  uiState
} from "../core/uiState.js";
import { handleCalendarClick } from "./calendarHandlers.js";
import { handleCurrencySubmit } from "./currencyHandlers.js";
import { handleFilterSubmit, handlePageButton } from "./filterHandlers.js";
import { handleModalForm } from "./modalHandlers.js";

function focusModal() {
  queueMicrotask(() => {
    const modal = document.querySelector(".modal");
    const target = modal?.querySelector("input, select, button");
    (target || modal)?.focus();
  });
}

function announce(message, render) {
  setToast(message);
  setTimeout(() => {
    setToast("");
    render();
  }, 2600);
}

// Event delegation keeps listeners stable even though each render replaces #app HTML.
export function bindAppHandlers(render) {
  document.addEventListener("click", (event) => {
    if (handleCalendarClick(event)) return;

    const modalTrigger = event.target.closest("[data-modal]");
    if (modalTrigger) {
      openModalState(modalTrigger.dataset.modal, modalTrigger.dataset.id || "");
      render();
      focusModal();
      return;
    }

    const closeTrigger = event.target.closest("[data-close-modal]");
    if (closeTrigger && (event.target === closeTrigger || closeTrigger.matches("button"))) {
      closeModalState();
      render();
      return;
    }

    const pageButton = event.target.closest("[data-page-view]");
    if (pageButton) {
      handlePageButton(pageButton);
      return;
    }

    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action === "logout") {
      logout();
      window.location.href = "index.html";
      return;
    }
    if (action === "toggle-sidebar") {
      toggleSidebar();
      render();
      return;
    }
    if (action === "currency-retry") {
      uiState.currency.error = "";
      uiState.currency.currencies = null;
      render();
    }
  });

  document.addEventListener("submit", async (event) => {
    const filterForm = event.target.closest("[data-filter-form]");
    if (filterForm) {
      event.preventDefault();
      handleFilterSubmit(filterForm);
      return;
    }

    const modalForm = event.target.closest("[data-modal-form]");
    if (modalForm) {
      event.preventDefault();
      try {
        const message = handleModalForm(modalForm);
        closeModalState();
        announce(message, render);
      } catch (error) {
        setFormError(error.message);
      }
      render();
      return;
    }

    const currencyForm = event.target.closest("[data-currency-form]");
    if (currencyForm) {
      event.preventDefault();
      await handleCurrencySubmit(currencyForm, render);
    }
  });

  document.addEventListener("change", (event) => {
    const form = event.target.closest("[data-filter-form]");
    if (form && event.target.matches("select")) handleFilterSubmit(form);
  });

  document.addEventListener("input", (event) => {
    if (!event.target.matches("[data-count-source]")) return;
    const target = event.target.closest("label")?.querySelector("[data-count-target]");
    if (target) target.textContent = event.target.value.length;
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && uiState.modal) {
      closeModalState();
      render();
    }
  });

  window.addEventListener("hashchange", () => {
    closeModalState();
    render();
  });
}
