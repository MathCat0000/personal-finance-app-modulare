# Components

Sources: `src/components/*.js`

Components receive prepared data and return HTML. They do not mutate domain state.

## Form controls

### selected(value, expected)

```text
compare both values as strings
return the HTML selected attribute when equal
otherwise return empty text
```

### optionList(options, value, labelKey, valueKey)

```text
for every string or option object
  read its value and label
  escape both for HTML
  mark it selected when it matches value
join and return all option elements
```

### themeOptions(value)

```text
map configured themes to option elements
mark the current value selected
return the joined HTML
```

## Small display components

### summaryCard(label, value, tone)

```text
return a summary article containing label and formatted value
add the optional tone class
```

### sectionHeader(title, href, label)

```text
return a section heading
include a link only when href exists
```

### progressBar(percent, color)

```text
normalize the visible width between 0 and 100
return an accessible progress track with the requested color
```

### emptyState(title, body)

```text
escape title and body
return the empty-state HTML
```

### paginationControls(result, viewName)

```text
render previous and next buttons with target page numbers
disable buttons when the result has no previous or next page
show current page and total pages
```

## Transaction components

### transactionLine(transaction, options)

```text
choose positive or negative amount class
escape transaction name and category
format date and signed amount
render avatar and fields
optionally render a delete button
return the list item
```

### transactionTable(transactions)

```text
map every transaction to a responsive table row
escape text and format date and signed amount
include the delete action for each row
return the complete table wrapper
```

## Domain cards

### budgetCard(budget)

```text
render category, edit and delete actions
render maximum, progress, spent, and free amounts
render up to three latest spending transaction lines
link to the filtered transaction route
return the budget article
```

### potCard(pot)

```text
render name, edit, and delete actions
render saved total, target, and progress
render add-money and withdraw actions
return the pot article
```

## Page shell

### pageShell(page)

```text
render the skip link, responsive sidebar, logo, and route navigation
mark the current navigation item active
render signed-in user, page title, actions, and page content
render toast live region and modal root
return the complete SPA HTML
```

## Calendar

### todayIso()

```text
return today's date as YYYY-MM-DD
```

### calendarMonthIso(value)

```text
use value or today
return the first day of its month as YYYY-MM-01
```

### formatPickerDate(value)

```text
if value is empty
  return the date-field placeholder
reorder YYYY-MM-DD as DD/MM/YYYY
```

### shiftCalendarMonth(value, delta)

```text
read year and month
add delta months using a UTC Date
return the first day as ISO date text
```

### calendarDays(monthIso)

```text
find the Monday that starts the six-week calendar grid
create 42 consecutive day records
mark records outside the requested month
return the records
```

### renderCalendar(monthIso, selectedIso)

```text
render month navigation and weekday labels
render 42 date buttons
mark outside, selected, and today states
render clear and today actions
return the calendar HTML
```

### syncCalendar(field)

```text
read hidden input, label, popover, and current month
synchronize field data attributes and visible label
rerender the calendar popover
```

### setCalendarOpen(field, open)

```text
update trigger aria-expanded
show or hide the popover
```

## Modal

### errorHtml(uiState)

```text
if no form error exists
  return empty text
escape and render the error otherwise
```

### confirmModal(...)

```text
render title, description, current error, confirmation, and cancel controls
```

### transactionModal(mode, id, appState, uiState)

```text
if deleting
  find the transaction and render confirmation
otherwise
  choose the default context date
  render the create form and calendar
```

### budgetModal(mode, id, appState, uiState)

```text
find the budget when editing or deleting
render confirmation for delete
calculate available categories
render create or edit fields and actions
```

### potModal(mode, id, appState, uiState)

```text
find the selected pot when required
render delete confirmation, money transfer form, or create/edit form
render the correct available amount and character count
```

### renderModal(appState, uiState)

```text
if no modal is active
  return empty text
split modal type into domain and mode
delegate content to the matching modal builder
wrap it in the accessible dialog and backdrop
return the HTML
```
