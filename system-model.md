# System model - Personal Finance App

## Architecture

```text
HTML and CSS
  index.html       landing page
  login.html       demo sign-in
  app.html         SPA host document
  test.html        browser test runner
  styles.css       complete responsive styling

src/core
  constants.js     fixed configuration
  utils.js         generic value transformations
  state.js         single in-memory source of truth
  persistence.js   localStorage and data.json seed boundary
  actions.js       validation and domain mutations
  selectors.js     pure derived data
  uiState.js       temporary interface state

src/components     reusable HTML generators
src/views          overview, transactions, budgets, pots, recurring, currency
src/handlers       events, forms, modals, filters, calendar, and currency
src/router         hash routes and URL parameters
src/services       Frankfurter API integration
src/app.js         SPA bootstrap, route map, and render coordinator
src/login.js       login-page bootstrap
```

## Central flow

```text
user event
  -> handler
  -> action or router
  -> domain state, UI state, or URL changes
  -> render
  -> selector
  -> view
  -> component
  -> HTML
```

## State categories

```text
domain state
  session, balance, transactions, budgets, pots
  owned by state.js and persisted by persistence.js

UI state
  modal, form error, toast, sidebar, currency loading and result
  owned by uiState.js and mostly temporary

URL state
  route, search, category, sorting, and page
  owned by window.location.hash
```

## Dependency direction

```text
constants and utils
  -> state and persistence
  -> actions and selectors
  -> components and views
  -> handlers
  -> app bootstrap
```

## Architectural rules

- Only actions mutate finance-domain state.
- Persistence normalizes all external data before it enters state.
- Selectors never mutate their arguments.
- Components and views do not call localStorage.
- Components receive prepared data and return HTML.
- Handlers translate DOM events into domain actions or route changes.
- Services isolate external network access.
- `app.js` coordinates modules but contains no feature markup or domain rules.
