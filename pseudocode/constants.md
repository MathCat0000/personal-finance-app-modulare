# Constants

Source: `src/core/constants.js`

Constants are fixed configuration chosen by the application, not data that changes while the user works.

## STORAGE_KEY

```text
define the unique localStorage key used by this application
use the same key when saving, reading, and deleting persisted state
```

## ITEMS_PER_PAGE

```text
define how many transactions or bills appear on one page
```

## MAX_POT_NAME_LENGTH

```text
define the maximum accepted number of characters for a pot name
```

## DEFAULT_AVATAR

```text
define the fallback image path for transactions without an avatar
```

## CATEGORIES

```text
define the allowed transaction and budget categories
use this list for validation and select controls
```

## THEMES

```text
define the allowed display colors as name/value pairs
use the first theme as the safe fallback
```

## TRANSACTION_SORTS and BILL_SORTS

```text
define the labels and values accepted by sorting controls
```

## NAV_ITEMS

```text
define each SPA route with its label and icon
use the list to render the application navigation
```
