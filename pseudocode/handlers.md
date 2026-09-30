# Event handlers

Sources: `src/handlers/*.js`

Handlers translate DOM events and form data into router updates, domain actions, or temporary UI changes.

## Transaction, budget, and pot handlers

### handleTransactionAction(type, data, id)

```text
if type creates a transaction
  read fields from FormData
  call createTransaction
  return the success message
if type deletes a transaction
  call deleteTransaction with id
  return the success message
return null when type belongs to another domain
```

### handleBudgetAction(type, data, id)

```text
dispatch create, edit, or delete budget by type
read required fields from FormData
call the matching action
return its success message or null
```

### handlePotAction(type, data, id)

```text
dispatch create, edit, add, withdraw, or delete pot by type
read required fields from FormData
call the matching action
return its success message or null
```

### handleModalForm(form)

```text
create FormData from form
read modal action type and entity id
ask transaction, budget, and pot handlers in order
if none accepts the type
  throw an unknown-action error
return the success message
```

## Filter handlers

### handleFilterSubmit(form)

```text
read FormData and filter type
for transactions
  update search, sort, category, and reset page to one
for recurring bills
  update search, sort, and reset page to one
write the result to the hash route
```

### handlePageButton(button)

```text
merge the target page with current URL parameters
update the transaction or recurring route
```

## Currency handlers

### ensureCurrencies(render)

```text
if currencies already exist, are loading, or have an error
  stop
mark loading and render
try to fetch currencies
  store the result and clear error
catch failure
  store the message
finally
  clear loading and render
```

### handleCurrencySubmit(form, render)

```text
read amount, from, and to into UI state
clear previous error and result
validate positive amount and different currencies
mark loading and render
try to convert currency
  store the result
catch failure
  store the message
finally
  clear loading and render
```

## Calendar handler

### handleCalendarClick(event)

```text
if previous or next month was clicked
  shift month, synchronize, and keep calendar open
if a date was clicked
  update hidden input, synchronize, and close
if clear was clicked
  clear input, synchronize, and close
if today was clicked
  select today, synchronize, and close
if trigger was clicked
  synchronize and toggle the popover
return whether a calendar control handled the event
```

## Application event delegation

### focusModal()

```text
wait until the modal HTML has rendered
focus the first form control or the dialog itself
```

### announce(message, render)

```text
store the toast message
schedule it to clear after a short delay
render after clearing
```

### bindAppHandlers(render)

```text
register one delegated click listener
  handle calendar, modal open/close, pagination, logout, sidebar, and currency retry
register one delegated submit listener
  handle filters, modal actions with error reporting, and currency conversion
register change listener for automatic select filters
register input listener for pot-name character count
register Escape listener to close a modal
register hashchange listener to close modal and rerender
```
