# Application bootstrap

Sources: `src/app.js` and `src/login.js`

## SPA render()

```text
read and validate the current route
if the hash path is unknown
  redirect it to the default overview route
select the route's view function
build context from domain state, UI state, route parameters, and modal HTML
render the view into #app
if the current route is currency
  start loading currencies when required
```

## SPA startup

```text
find #app
create the route-to-view map
bind delegated application handlers
try to initialize state
if the session is not authenticated
  navigate to index.html
otherwise
  set the default hash when missing
  render the SPA
if bootstrap fails
  render an escaped error page with a landing-page link
```

## Login showError(message)

```text
write message into the error element
make the error visible
```

## Login startup and submit

```text
initialize state
if an authenticated session already exists
  navigate directly to the overview
when the login form is submitted
  prevent the browser's default submission
  read FormData
  require a password of at least six characters
  call the login domain action with name and email only
  navigate to the overview
  show any validation or bootstrap error
```
