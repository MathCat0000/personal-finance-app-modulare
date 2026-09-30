# Selectors

Source: `src/core/selectors.js`

Selectors read state and calculate display data. They never mutate their arguments.

## paginate(items, page, perPage)

```text
normalize perPage to at least one
calculate at least one total page
clamp current page between first and last page
calculate the starting index
return the page slice and pagination metadata
```

## getIncome(appState)

```text
keep transactions with positive amounts
sum their amounts
normalize and return the total
```

## getExpenses(appState)

```text
keep transactions with negative amounts
sum them
return the normalized absolute total
```

## getAvailableBalance(appState)

```text
normalize and return appState.balance.current
```

## sortTransactions(transactions, sort)

```text
copy the array
choose comparison by requested mode
  latest or oldest date
  ascending or descending name
  highest or lowest amount
sort and return the copy
```

## getFilteredTransactions(appState, query)

```text
normalize the search text to lowercase
keep transactions matching the name search
keep transactions matching category unless category is empty or all
sort the filtered result
paginate it
return pagination data
```

## getSpentForCategory(appState, category)

```text
find the dataset context date
keep negative transactions in category and context month
sum the amounts
return the normalized absolute value
```

## getLatestSpendingForCategory(appState, category, count)

```text
keep negative transactions in category
sort by latest date
return the first count entries
```

## getBudgetSummary(appState, budget)

```text
calculate spent amount for the budget category
calculate free amount without going below zero
calculate percentage of maximum used
get the latest category spending
return the original budget fields plus all derived fields
```

## getBudgetsWithSummaries(appState)

```text
map every budget through getBudgetSummary
return the summaries
```

## getAvailableCategories(appState, includeCategory)

```text
collect categories already used by budgets
return configured categories that are unused
also include includeCategory so an existing budget can keep its category
```

## getAllPotsProgress(appState)

```text
for every pot
  copy its fields
  calculate total as a percentage of target
return the resulting array
```

## buildRecurringBills(appState)

```text
find the dataset context date
group recurring transactions by vendor name
for every vendor group
  sort transactions by latest date
  use the latest transaction for display fields
  determine whether a payment exists in the context month
  derive its monthly due day and due date
  calculate days from context date to due date
  mark status as paid, dueSoon within five days, or upcoming
return one bill per vendor
```

## sortBills(bills, sort)

```text
copy the array
sort by due day, vendor name, or amount according to the mode
return the copy
```

## getRecurringBills(appState, query)

```text
build one recurring bill per vendor
filter by lowercase vendor search
sort the result
paginate it
return pagination data
```

## getRecurringSummary(appState)

```text
build recurring bills
sum all amounts
sum amounts and counts separately for paid, upcoming, and dueSoon
return the summary object
```

## getOverviewData(appState)

```text
collect available balance, derived income, and derived expenses
collect pot progress and budget summaries
collect recurring summary
sort transactions and keep the five latest
return the complete overview view model
```
