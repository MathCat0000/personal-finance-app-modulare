# Currency service

Source: `src/services/currencyService.js`

The service isolates all communication with the Frankfurter v2 API.

## fetchCurrencies()

```text
request the currencies endpoint
if the response failed
  throw a user-facing service error
parse the currency array
convert it to a map from ISO code to name
return the map
```

## convertCurrency(input)

```text
build the pair-rate URL from source and target currency
request the rate
parse the response
if the response failed
  throw the API message or a fallback message
normalize the requested amount
multiply it by the returned rate
return date, base, target rate map, and raw rate
```
