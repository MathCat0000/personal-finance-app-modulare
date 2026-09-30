// Fixed application configuration. These values are not runtime state.

export const STORAGE_KEY = "financeAppState";
export const ITEMS_PER_PAGE = 10;
export const MAX_POT_NAME_LENGTH = 30;
export const DEFAULT_AVATAR = "./assets/images/avatars/urban-services-hub.jpg";

export const CATEGORIES = [
  "Entertainment",
  "Bills",
  "Groceries",
  "Dining Out",
  "Transportation",
  "Personal Care",
  "Education",
  "Lifestyle",
  "Shopping",
  "General"
];

export const THEMES = [
  { name: "Green", value: "#277C78" },
  { name: "Yellow", value: "#F2CDAC" },
  { name: "Cyan", value: "#82C9D7" },
  { name: "Navy", value: "#626070" },
  { name: "Red", value: "#C94736" },
  { name: "Purple", value: "#826CB0" },
  { name: "Turquoise", value: "#597C7C" },
  { name: "Brown", value: "#93674F" },
  { name: "Magenta", value: "#934F6F" },
  { name: "Blue", value: "#3F82B2" },
  { name: "Navy Grey", value: "#97A0AC" },
  { name: "Army Green", value: "#7F9161" },
  { name: "Pink", value: "#AF81BA" },
  { name: "Gold", value: "#CAB361" },
  { name: "Orange", value: "#BE6C49" }
];

export const TRANSACTION_SORTS = [
  { label: "Latest", value: "latest" },
  { label: "Oldest", value: "oldest" },
  { label: "A to Z", value: "az" },
  { label: "Z to A", value: "za" },
  { label: "Highest", value: "highest" },
  { label: "Lowest", value: "lowest" }
];

export const BILL_SORTS = [
  { label: "Latest", value: "latest" },
  { label: "Oldest", value: "oldest" },
  { label: "A to Z", value: "az" },
  { label: "Z to A", value: "za" },
  { label: "Highest", value: "highest" },
  { label: "Lowest", value: "lowest" }
];

export const NAV_ITEMS = [
  { hash: "#/overview", label: "Overview", icon: "./assets/images/icon-nav-overview.svg" },
  { hash: "#/transactions", label: "Transactions", icon: "./assets/images/icon-nav-transactions.svg" },
  { hash: "#/budgets", label: "Budgets", icon: "./assets/images/icon-nav-budgets.svg" },
  { hash: "#/pots", label: "Pots", icon: "./assets/images/icon-nav-pots.svg" },
  { hash: "#/recurring", label: "Recurring Bills", icon: "./assets/images/icon-nav-recurring-bills.svg" },
  { hash: "#/currency", label: "Currency", icon: "./assets/images/icon-nav-currency-exchange.svg" }
];
