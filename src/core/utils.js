// Pure value transformations: no DOM, storage, routing, or domain-state access.

// Escape ampersands first so the entities introduced later are not escaped twice.
export function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function generateId(prefix = "id") {
  if (globalThis.crypto?.randomUUID) {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function stableId(prefix, ...parts) {
  const slug = parts
    .map((part) =>
      String(part)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    )
    .filter(Boolean)
    .join("-");

  return `${prefix}-${slug}`;
}

export function toMoney(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.round(number * 100) / 100;
}

export function formatCurrency(value, { signed = false, compact = false } = {}) {
  const amount = toMoney(value);
  const abs = Math.abs(amount);

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: compact && abs >= 1000 ? 0 : 2,
    maximumFractionDigits: compact && abs >= 1000 ? 0 : 2
  }).format(abs);

  if (!signed) return formatted;
  if (amount > 0) return `+${formatted}`;
  if (amount < 0) return `-${formatted}`;
  return formatted;
}

export function formatDate(value) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export function formatBillDate(day) {
  const suffix =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
          ? "rd"
          : "th";

  return `Monthly - ${day}${suffix}`;
}

export function getContextDate(transactions) {
  if (!transactions.length) return new Date();

  return transactions.reduce((latest, transaction) => {
    const date = new Date(transaction.date);
    return date > latest ? date : latest;
  }, new Date(transactions[0].date));
}

export function isSameMonth(value, contextDate) {
  const date = new Date(value);

  return (
    date.getUTCFullYear() === contextDate.getUTCFullYear() &&
    date.getUTCMonth() === contextDate.getUTCMonth()
  );
}

export function dateForContextDay(day, contextDate) {
  return new Date(
    Date.UTC(
      contextDate.getUTCFullYear(),
      contextDate.getUTCMonth(),
      day,
      12,
      0,
      0
    )
  );
}

export function daysBetween(start, end) {
  const ms =
    Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()) -
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());

  return Math.round(ms / 86400000);
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function percentage(part, total) {
  if (!total) return 0;

  return clamp(Math.round((part / total) * 100), 0, 999);
}

export function normalizePage(value) {
  const page = Number.parseInt(value, 10);

  return Number.isFinite(page) && page > 0 ? page : 1;
}
