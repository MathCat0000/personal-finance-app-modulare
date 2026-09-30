# Pseudocode index

These documents describe the application logic without JavaScript syntax. They follow the same dependency direction as the source code.

1. [Constants](./constants.md)
2. [Utilities](./utils.md)
3. [State](./state.md)
4. [Persistence](./persistence.md)
5. [Actions](./actions.md)
6. [Selectors](./selectors.md)
7. [Router](./router.md)
8. [UI state](./ui-state.md)
9. [Components](./components.md)
10. [Views](./views.md)
11. [Handlers](./handlers.md)
12. [Currency service](./currency-service.md)
13. [Application bootstrap](./bootstrap.md)

The central flow is:

```text
user event
  -> handler
  -> action or router
  -> state or URL changes
  -> render
  -> selector
  -> view
  -> component
  -> HTML
```
