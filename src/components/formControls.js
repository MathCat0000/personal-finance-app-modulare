import { THEMES } from "../core/constants.js";
import { escapeHtml } from "../core/utils.js";

export function selected(value, expected) {
  return String(value) === String(expected) ? "selected" : "";
}

export function optionList(options, value, labelKey = "label", valueKey = "value") {
  return options.map((option) => {
    const optionValue = typeof option === "string" ? option : option[valueKey];
    const optionLabel = typeof option === "string" ? option : option[labelKey];
    return `<option value="${escapeHtml(optionValue)}" ${selected(value, optionValue)}>${escapeHtml(optionLabel)}</option>`;
  }).join("");
}

export function themeOptions(value) {
  return THEMES.map((theme) => `<option value="${theme.value}" ${selected(value, theme.value)}>${theme.name}</option>`).join("");
}
