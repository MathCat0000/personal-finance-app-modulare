# UI state

Source: `src/core/uiState.js`

UI state is temporary interface data. It is separate from the persisted finance domain.

## uiState

```text
store the active modal, form error, toast, and sidebar preference
store currency form values, currencies, loading, error, and result
read only the sidebar preference from localStorage
```

## openModalState(type, id)

```text
store modal type and optional entity id
clear the previous form error
```

## closeModalState()

```text
clear the active modal
clear the form error
```

## setFormError(message)

```text
convert message to text
store it as the current form error
```

## setToast(message)

```text
convert message to text
store it as the current notification
```

## toggleSidebar()

```text
invert sidebarCollapsed
persist only this display preference
return the new value
```
