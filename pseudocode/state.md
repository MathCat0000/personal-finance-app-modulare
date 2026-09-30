# State

Source: `src/core/state.js`

The exported `state` object is the single in-memory source of truth for domain data.

## createEmptyState()

```text
return a new object containing
  an unauthenticated empty session
  a zeroed balance object
  a new empty transactions array
  a new empty budgets array
  a new empty pots array
```

## state

```text
create the shared state object once by calling createEmptyState
export that same object to every module
```

## copyObject(defaults, value)

```text
if value is not a plain object
  return a copy of defaults
return a new object containing defaults followed by value
```

## copyArray(value)

```text
if value is an array
  return a shallow copy
return a new empty array
```

## replaceState(nextState)

Purpose: update the shared object without replacing its identity.

```text
create a fresh empty state for defaults
copy session into state.session
copy balance into state.balance
copy each domain collection into its existing state property
return the shared state object
```

## resetState()

```text
create a fresh empty state
pass it to replaceState
return the reset shared state
```
