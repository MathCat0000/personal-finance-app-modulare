# Personal Finance App

Framework-free, modular JavaScript implementation of the [Frontend Mentor Personal Finance App challenge](https://www.frontendmentor.io/challenges/personal-finance-app-JfjtZgyMt1).

The project is intentionally built with native browser APIs and ES modules. Its purpose is to demonstrate domain modelling, state ownership, testable boundaries, progressive enhancement, and a static-deployment workflow without hiding the architecture behind a framework.

![Personal Finance App preview](./preview.jpg)

## What it includes

- Demo login with client-side validation; passwords are never persisted.
- Hash-based single-page navigation for overview, transactions, budgets, pots, recurring bills, and currency exchange.
- Central domain state with explicit actions and pure selectors.
- Transaction creation and deletion with balance invariants.
- Budget CRUD with category uniqueness.
- Savings-pot creation, editing, funding, withdrawal, and deletion.
- Search, sorting, filtering, and pagination for transactions and recurring bills.
- `localStorage` persistence with deterministic `data.json` first-run data.
- Frankfurter currency lookup and conversion with loading and error states.
- Semantic HTML, responsive CSS, keyboard-oriented controls, and accessible live regions.

## Run locally

The browser must load the app through HTTP because the project uses native ES modules and `fetch()`.

```bash
npm start
```

Open <http://127.0.0.1:5512/> and use any valid email address with a password of at least six characters.

There is no production build step and no runtime npm dependency.

## Verify

```bash
npm test
```

The verification command runs:

| Layer | Scope |
| --- | --- |
| Unit | utilities, state, persistence, domain actions, selectors, router, components, currency service |
| Integration | state bootstrap, every supported route, delegated event-listener registration |
| Browser view | `test.html` exposes the test output when served locally |

Network calls are replaced by deterministic test doubles in automated tests. Browser-driven end-to-end and visual regression tests remain explicit follow-up work.

## Architecture

```text
src/
  core/        constants, utilities, state, persistence, actions, selectors
  components/  reusable HTML generators
  views/       complete route views
  handlers/    DOM events and form-to-domain adapters
  router/      hash paths and URL parameters
  services/    external API access
  app.js       SPA bootstrap and render coordinator
  login.js     login-page bootstrap
```

Runtime flow:

```text
DOM event
  -> handler
  -> domain action or router
  -> domain/UI/URL state
  -> render
  -> selector
  -> view
  -> component
  -> HTML
```

The design is a modular client-side monolith with a light functional-core/imperative-shell split:

- `actions.js` owns validated domain commands and state mutations;
- `selectors.js` owns derived read models and does not mutate input;
- `persistence.js` is the boundary for stored and seed data;
- handlers translate browser events into domain commands or URL changes;
- views and components render prepared data and do not own domain state;
- `currencyService.js` isolates the external HTTP API.

## Project documents

- [Requirements contract](./requirement-contract.md)
- [System model](./system-model.md)
- [Pseudocode index](./pseudocode/README.md)

These documents are intentionally kept alongside the implementation: requirements describe expected behaviour, the system model describes ownership, pseudocode describes the algorithm before syntax, and tests provide executable examples.

## Design decisions and known limits

This is a portfolio and learning project, not a production financial service.

- Authentication is a client-side demo flow.
- Domain state is kept in memory and persisted in `localStorage`.
- There is no backend, multi-user isolation, schema migration system, or server-side validation.
- The current test harness covers core logic and SPA bootstrap; it does not yet provide automated browser E2E, accessibility auditing, or visual regression.
- A future service version should separate pure use cases from storage/API adapters, introduce schema versions and migrations, inject the application clock, and formalize balance invariants.

## Attribution

Design, starter data, fonts, and image assets were supplied by [Frontend Mentor](https://www.frontendmentor.io/). The implementation and architecture are original to this repository.
