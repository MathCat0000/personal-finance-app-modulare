# Router

Source: `src/router/router.js`

The router stores navigation and list controls in `window.location.hash`.

## currentPath(hash)

```text
remove the query string from hash
if the path exists in ROUTE_PATHS
  return it
return DEFAULT_ROUTE
```

## parseHashParams(hash)

```text
take the text after the question mark
parse it with URLSearchParams
convert the entries to a plain object
return the object
```

## buildHash(path, params)

```text
create empty URLSearchParams
for every parameter
  ignore empty, null, or undefined values
  add all other values
return path followed by the query string when one exists
```

## setHash(path, params)

```text
build the new hash
assign it to window.location.hash
```

## paramsWith(overrides, hash)

```text
read current hash parameters
merge overrides over them
remove empty, null, and undefined values
return the merged object
```
