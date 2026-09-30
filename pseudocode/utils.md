# Utilities

Source: `src/core/utils.js`

Utilities transform values. They do not read application state, localStorage, or the DOM.

## escapeHtml(value = "")

Purpose: make untrusted text safe before inserting it into an HTML template.

```text
convert value to a string
replace ampersand first
replace less-than and greater-than signs
replace double and single quotes
return the escaped string
```

## generateId(prefix = "id")

Purpose: create a different identifier for a new domain entity.

```text
if the global crypto API provides randomUUID
  return prefix + a generated UUID
otherwise
  combine prefix, current timestamp, and a random hexadecimal fragment
return the generated identifier
```

## stableId(prefix, ...parts)

Purpose: create the same fallback identifier for the same imported data.

```text
for each part
  convert it to lowercase text
  trim surrounding whitespace
  replace groups of non-alphanumeric characters with a hyphen
  remove leading and trailing hyphens
remove empty parts
join the remaining parts with hyphens
prepend the prefix
return the stable identifier
```

## toMoney(value)

Purpose: normalize a value to a finite number with two decimal places.

```text
convert value to a number
if it is not finite
  return 0
round the number to two decimal places
return the result
```

## formatCurrency(value, options)

Purpose: format a number as USD for display.

```text
normalize value with toMoney
remember its sign and absolute value
configure Intl.NumberFormat for USD
if compact display is enabled for a large value
  show zero decimal places
otherwise
  show two decimal places
format the absolute value
if signed display is disabled
  return the formatted value
prepend plus or minus when required
return the result
```

## formatDate(value)

Purpose: turn an ISO date into a short readable date.

```text
create a Date from value
format it with day, abbreviated month, and year
return the formatted string
```

## formatBillDate(day)

Purpose: describe a recurring monthly payment day.

```text
choose st, nd, rd, or th from the day number
return "Monthly - " + day + suffix
```

## getContextDate(transactions)

Purpose: find the newest transaction date used as the dataset's current date.

```text
if transactions is empty
  return today's date
start with the first transaction date
for every transaction
  replace the current latest date when its date is newer
return the latest date
```

## isSameMonth(value, contextDate)

```text
convert value to a Date
compare its UTC year with contextDate's UTC year
compare its UTC month with contextDate's UTC month
return true only when both match
```

## dateForContextDay(day, contextDate)

```text
read UTC year and month from contextDate
create a UTC date using that year, month, and day at midday
return the new Date
```

## daysBetween(start, end)

```text
convert both dates to UTC midnight timestamps
subtract start from end
divide by the number of milliseconds in one day
round and return the number of days
```

## clamp(value, min, max)

```text
if value is below min
  return min
if value is above max
  return max
return value
```

## percentage(part, total)

```text
if total is empty or zero
  return 0
calculate part divided by total multiplied by 100
round the result
clamp it between 0 and 999
return the percentage
```

## normalizePage(value)

```text
parse value as a base-10 integer
if it is finite and greater than zero
  return it
return page 1
```
