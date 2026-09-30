import { calendarMonthIso, setCalendarOpen, shiftCalendarMonth, syncCalendar, todayIso } from "../components/calendar.js";

export function handleCalendarClick(event) {
  const navigation = event.target.closest("[data-calendar-nav]");
  if (navigation) {
    const field = navigation.closest("[data-calendar]");
    field.dataset.month = shiftCalendarMonth(field.dataset.month, Number(navigation.dataset.calendarNav));
    syncCalendar(field);
    setCalendarOpen(field, true);
    return true;
  }
  const dateButton = event.target.closest("[data-calendar-date]");
  if (dateButton) {
    const field = dateButton.closest("[data-calendar]");
    const input = field.querySelector("[data-calendar-input]");
    input.value = dateButton.dataset.calendarDate;
    field.dataset.month = calendarMonthIso(input.value);
    syncCalendar(field);
    setCalendarOpen(field, false);
    return true;
  }
  const clearButton = event.target.closest("[data-calendar-clear]");
  if (clearButton) {
    const field = clearButton.closest("[data-calendar]");
    field.querySelector("[data-calendar-input]").value = "";
    syncCalendar(field);
    setCalendarOpen(field, false);
    return true;
  }
  const todayButton = event.target.closest("[data-calendar-today]");
  if (todayButton) {
    const field = todayButton.closest("[data-calendar]");
    const input = field.querySelector("[data-calendar-input]");
    input.value = todayIso();
    field.dataset.month = calendarMonthIso(input.value);
    syncCalendar(field);
    setCalendarOpen(field, false);
    return true;
  }
  const toggle = event.target.closest("[data-calendar-toggle]");
  if (toggle) {
    const field = toggle.closest("[data-calendar]");
    const popover = field.querySelector("[data-calendar-popover]");
    syncCalendar(field);
    setCalendarOpen(field, popover.hidden);
    return true;
  }
  return false;
}
