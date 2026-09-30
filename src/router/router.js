// Hash routing keeps the static application deployable without server-side rewrites.
export const DEFAULT_ROUTE = "#/overview";
export const ROUTE_PATHS = ["#/overview", "#/transactions", "#/budgets", "#/pots", "#/recurring", "#/currency"];

export function currentPath(hash = window.location.hash) {
  const path = String(hash).split("?")[0];
  return ROUTE_PATHS.includes(path) ? path : DEFAULT_ROUTE;
}

export function parseHashParams(hash = window.location.hash) {
  const [, query = ""] = String(hash).split("?");
  return Object.fromEntries(new URLSearchParams(query));
}

export function buildHash(path, params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") search.set(key, value);
  });
  return `${path}${search.toString() ? `?${search}` : ""}`;
}

export function setHash(path, params = {}) {
  window.location.hash = buildHash(path, params);
}

export function paramsWith(overrides = {}, hash = window.location.hash) {
  const params = { ...parseHashParams(hash), ...overrides };
  Object.keys(params).forEach((key) => {
    if (params[key] === "" || params[key] === null || params[key] === undefined) delete params[key];
  });
  return params;
}
