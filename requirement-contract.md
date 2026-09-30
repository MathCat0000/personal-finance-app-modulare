# Requirement contract - Personal Finance App

## Purpose

Build a modular vanilla JavaScript personal finance application while keeping domain logic, persistence, selectors, views, components, event handlers, routing, and external services separate.

## User capabilities

The user must be able to:

- sign in with a name, valid email address, and demo password;
- view an overview dashboard;
- browse, search, sort, filter, and paginate transactions;
- create and delete transactions;
- see current balance, income, and expenses update consistently;
- create, edit, and delete budgets;
- see spending, limit, remaining amount, and progress for each budget;
- create, edit, fund, withdraw from, and delete savings pots;
- see recurring bills grouped by vendor;
- search and sort recurring bills;
- convert currencies through an external API when the network is available;
- keep application data after a refresh through localStorage.

## Constraints

- Vanilla JavaScript with native ES modules.
- No framework or backend.
- No mandatory bundler or build step.
- Persistence through localStorage.
- Navigation through hash routing.
- Responsive semantic HTML and CSS.
- Automated tests for isolated logic and SPA integration.

## Domain rules

- Income transactions have positive amounts.
- Expense transactions have negative amounts.
- Creating or deleting a transaction updates the current balance and totals.
- Each budget uses a unique category.
- Pot names are unique without case sensitivity.
- Adding money to a pot decreases the available balance.
- Withdrawing from a pot increases the available balance.
- Deleting a pot returns its total to the available balance.
- Income, expenses, budget summaries, pot progress, and recurring summaries are derived data.
- Demo passwords are validated but never persisted.

## Success criteria

The implementation is complete when:

- the domain core passes its automated tests;
- every feature reads or changes state through the correct module;
- `app.js` remains a lightweight coordinator;
- views and components contain no domain mutations;
- actions generate no HTML;
- selectors do not mutate their arguments;
- application data survives a browser refresh;
- every supported route renders successfully.
