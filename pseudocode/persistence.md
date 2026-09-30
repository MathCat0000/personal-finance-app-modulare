# Persistence

Source: `src/core/persistence.js`

Persistence translates between raw external data and the valid in-memory state shape.

## saveState()

```text
serialize the central state as JSON
store the JSON under STORAGE_KEY in localStorage
return state
```

## readStoredState()

```text
try to read STORAGE_KEY from localStorage
if no value exists
  return null
try to parse the JSON
if reading or parsing fails
  return null
return the parsed value
```

## isStoredStateValid(value)

```text
verify value is an object
verify balance is an object
verify transactions, budgets, and pots are arrays
return whether every required structural check passed
```

## normalizeTransaction(transaction, index)

```text
parse transaction.date
if the date is invalid
  use the current date
build and return a transaction with
  existing id or a stable fallback id
  existing avatar or default avatar
  safe string name and category
  ISO date
  normalized monetary amount
  boolean recurring flag
```

## normalizeBudget(budget, index)

```text
normalize category to text
build and return a budget with
  existing id or stable fallback id
  category
  non-negative normalized maximum
  existing theme or default theme
```

## normalizePot(pot, index)

```text
normalize name to text
build and return a pot with
  existing id or stable fallback id
  name
  non-negative normalized target and total
  existing theme or default theme
```

## applyState(nextState)

```text
create default empty state
normalize session and loggedIn
normalize current, income, and expenses
map every transaction through normalizeTransaction
map every budget through normalizeBudget
map every pot through normalizePot
pass the normalized object to replaceState
return the shared state
```

## initState()

```text
read persisted state
if its structure is valid
  normalize and apply it
  save the normalized version
  return state
fetch data.json
if the response failed
  throw a bootstrap error
read the seed dataset
combine seed data with an existing session when available
normalize and apply the result
save the initial state
return state
```

## resetAppData()

```text
remove STORAGE_KEY from localStorage
reset the in-memory state
return the empty state
```
