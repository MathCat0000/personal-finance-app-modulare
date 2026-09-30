import { paramsWith, setHash } from "../router/router.js";

export function handleFilterSubmit(form) {
  const data = new FormData(form);
  if (form.dataset.filterForm === "transactions") {
    setHash("#/transactions", { search: data.get("search"), sort: data.get("sort"), category: data.get("category") === "all" ? "" : data.get("category"), page: 1 });
  }
  if (form.dataset.filterForm === "recurring") {
    setHash("#/recurring", { search: data.get("search"), sort: data.get("sort"), page: 1 });
  }
}

export function handlePageButton(button) {
  const params = paramsWith({ page: button.dataset.page });
  if (button.dataset.pageView === "transactions") setHash("#/transactions", params);
  if (button.dataset.pageView === "recurring") setHash("#/recurring", params);
}
