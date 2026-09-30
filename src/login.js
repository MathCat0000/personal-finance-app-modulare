import { login } from "./core/actions.js";
import { initState } from "./core/persistence.js";
import { state } from "./core/state.js";

const form = document.querySelector("#login-form");
const error = document.querySelector("#login-error");

function showError(message) {
  error.textContent = message;
  error.hidden = false;
}

try {
  await initState();
  if (state.session.loggedIn) window.location.href = "app.html#/overview";
} catch (bootstrapError) {
  showError(bootstrapError.message);
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  error.hidden = true;
  const data = new FormData(form);
  const password = String(data.get("password") || "");
  try {
    if (password.length < 6) throw new Error("Password must be at least 6 characters.");
    login({ name: data.get("name"), email: data.get("email") });
    window.location.href = "app.html#/overview";
  } catch (submitError) {
    showError(submitError.message);
  }
});
