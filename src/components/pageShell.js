import { NAV_ITEMS } from "../core/constants.js";
import { escapeHtml } from "../core/utils.js";

export function pageShell({ title, actions = "", content, path, userName, sidebarCollapsed = false, toast = "", modalHtml = "" }) {
  const collapseLabel = sidebarCollapsed ? "Expand menu" : "Collapse menu";
  return `<a href="#page-title" class="skip-link">Skip to content</a>
    <div class="app-shell ${sidebarCollapsed ? "is-sidebar-collapsed" : ""}">
      <aside class="sidebar" aria-label="Primary">
        <a class="sidebar__logo" href="#/overview"><img src="./assets/images/logo-large.svg" alt="finance" width="122" height="22"></a>
        <nav class="app-nav">${NAV_ITEMS.map((item) => `<a href="${item.hash}" class="app-nav__link ${path === item.hash ? "is-active" : ""}" ${path === item.hash ? 'aria-current="page"' : ""}><img src="${item.icon}" alt="" aria-hidden="true" width="24" height="24"><span>${item.label}</span></a>`).join("")}</nav>
        <button type="button" class="sidebar-toggle" data-action="toggle-sidebar" aria-label="${collapseLabel}" aria-pressed="${sidebarCollapsed}" title="${collapseLabel}"><img src="./assets/images/icon-minimize-menu.svg" alt="" aria-hidden="true" width="24" height="24"><span>${collapseLabel}</span></button>
      </aside>
      <main class="app-main">
        <header class="app-header"><div><p class="eyebrow">Signed in as ${escapeHtml(userName || "Demo User")}</p><h1 id="page-title">${title}</h1></div><div class="app-header__actions">${actions}<button type="button" class="btn btn--secondary" data-action="logout">Logout</button></div></header>
        <div class="view-stack">${content}</div>
      </main>
    </div>
    <div class="toast-region" aria-live="polite">${toast ? `<p class="toast">${escapeHtml(toast)}</p>` : ""}</div>
    <div id="modal-root">${modalHtml}</div>`;
}
