// The exported state object keeps one stable identity across the whole application.
export function createEmptyState() {
  return {
    session: {
      loggedIn: false,
      name: "",
      email: ""
    },
    balance: {
      current: 0,
      income: 0,
      expenses: 0
    },
    transactions: [],
    budgets: [],
    pots: []
  };
}

export const state = createEmptyState();

export function resetState() {
  return replaceState(createEmptyState());
}



function copyObject(defaults, value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ...defaults };
  }
  return { ...defaults, ...value }
}


function copyArray(value) {
  // A shallow copy is sufficient because persistence normalizes each entity first.
  return Array.isArray(value) ? [...value] : [];
}


// Mutate the shared container instead of replacing it, so every import stays current.
export function replaceState(nextState = {}) {
  const emptyState = createEmptyState();

  state.session = copyObject(emptyState.session, nextState.session);
  state.balance = copyObject(emptyState.balance, nextState.balance);
  state.transactions = copyArray(nextState.transactions);
  state.budgets = copyArray(nextState.budgets);
  state.pots = copyArray(nextState.pots);

  return state;

}