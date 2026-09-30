import { escapeHtml } from "../core/utils.js";

export function emptyState(title, body) {
  return `<div class="empty-state"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></div>`;
}
