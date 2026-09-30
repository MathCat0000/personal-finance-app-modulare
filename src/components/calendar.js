function isoFromDate(date) {
  return date.toISOString().slice(0, 10);
}

export function todayIso() {
  return isoFromDate(new Date());
}

export function calendarMonthIso(value) {
  const safeValue = value || todayIso();
  const [year, month] = safeValue.split("-");
  return `${year}-${month}-01`;
}

export function formatPickerDate(value) {
  if (!value) return "Select date";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

export function shiftCalendarMonth(value, delta) {
  const [year, month] = calendarMonthIso(value).split("-").map(Number);
  return isoFromDate(new Date(Date.UTC(year, month - 1 + delta, 1)));
}

function formatCalendarMonth(value) {
  const date = new Date(`${calendarMonthIso(value)}T00:00:00Z`);
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(date);
}

// Always render six weeks so the popover height does not jump between months.
function calendarDays(monthIso) {
  const [year, month] = calendarMonthIso(monthIso).split("-").map(Number);
  const firstOfMonth = new Date(Date.UTC(year, month - 1, 1));
  const mondayOffset = (firstOfMonth.getUTCDay() + 6) % 7;
  const start = new Date(Date.UTC(year, month - 1, 1 - mondayOffset));
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
    return { iso: isoFromDate(date), day: date.getUTCDate(), outside: date.getUTCMonth() !== month - 1 };
  });
}

export function renderCalendar(monthIso, selectedIso = "") {
  const today = todayIso();
  return `<div class="calendar-panel__header"><strong>${formatCalendarMonth(monthIso)}</strong><div class="calendar-panel__nav"><button type="button" data-calendar-nav="-1" aria-label="Previous month">‹</button><button type="button" data-calendar-nav="1" aria-label="Next month">›</button></div></div>
    <div class="calendar-weekdays" aria-hidden="true">${["M", "T", "W", "T", "F", "S", "S"].map((day) => `<span>${day}</span>`).join("")}</div>
    <div class="calendar-grid">${calendarDays(monthIso).map((day) => `<button type="button" class="calendar-day ${day.outside ? "is-outside" : ""} ${day.iso === selectedIso ? "is-selected" : ""} ${day.iso === today ? "is-today" : ""}" data-calendar-date="${day.iso}" aria-pressed="${day.iso === selectedIso}">${day.day}</button>`).join("")}</div>
    <div class="calendar-panel__footer"><button type="button" data-calendar-clear>Clear</button><button type="button" data-calendar-today>Today</button></div>`;
}

export function syncCalendar(field) {
  const input = field.querySelector("[data-calendar-input]");
  const label = field.querySelector("[data-calendar-label]");
  const popover = field.querySelector("[data-calendar-popover]");
  const month = field.dataset.month || calendarMonthIso(input.value || todayIso());
  field.dataset.month = month;
  field.dataset.selected = input.value;
  label.textContent = formatPickerDate(input.value);
  popover.innerHTML = renderCalendar(month, input.value);
}

export function setCalendarOpen(field, open) {
  const trigger = field.querySelector("[data-calendar-toggle]");
  const popover = field.querySelector("[data-calendar-popover]");
  trigger.setAttribute("aria-expanded", String(open));
  popover.hidden = !open;
}
