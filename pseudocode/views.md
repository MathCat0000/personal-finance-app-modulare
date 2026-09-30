# Views

Sources: `src/views/*.js`

A view requests derived data from selectors, composes components, and returns one complete page inside the shared shell.

## renderPage(context, page)

```text
combine page-specific title, actions, and content
add current route, user, sidebar, toast, and modal from context
pass the result to pageShell
return the complete HTML
```

## buildBudgetGradient(budgets)

```text
if no budgets exist
  return the empty donut color
calculate a total size from each maximum or spent value
walk through budgets while tracking the current angle
create one colored conic-gradient segment per budget
return all segments joined
```

## renderOverviewView(context)

```text
get the overview view model from selectors
calculate total saved and budget gradient
compose balance summaries
compose pots, budgets, recent transactions, and recurring panels
wrap content with renderPage
return HTML
```

## renderTransactionsView(context)

```text
normalize search, category, sort, and page from URL parameters
get filtered and paginated transactions
render filter controls
render transaction table and pagination when results exist
otherwise render an empty state
wrap content with renderPage
return HTML
```

## renderBudgetsView(context)

```text
get every budget summary
calculate total spent and total limit
render the donut and budget legend
render a budgetCard for every budget or an empty state
wrap content with renderPage
return HTML
```

## renderPotsView(context)

```text
get every pot with progress
render a potCard for every pot or an empty state
wrap content with renderPage
return HTML
```

## recurringTable(bills)

```text
map bills to responsive rows
render vendor, monthly date, status, and amount
return the table HTML
```

## renderRecurringView(context)

```text
normalize search, sort, and page from URL parameters
get recurring bills and summary
render total and status summaries
render filters, table, and pagination or an empty state
wrap content with renderPage
return HTML
```

## formatConverted(result, code)

```text
read the converted value for code
return zero when missing
format with up to four decimal places
```

## renderCurrencyView(context)

```text
read temporary currency UI state
use loaded currencies or a small fallback list
render amount, source, and target controls
render loading, error, retry, and conversion result states
wrap content with renderPage
return HTML
```
