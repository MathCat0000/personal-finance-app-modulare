import { emptyState } from "../components/emptyState.js";
import { potCard } from "../components/potCard.js";
import { getAllPotsProgress } from "../core/selectors.js";
import { renderPage } from "./viewHelpers.js";

export function renderPotsView(context) {
  const pots = getAllPotsProgress(context.appState);
  return renderPage(context, {
    title: "Pots",
    actions: '<button type="button" class="btn btn--primary" data-modal="pot-create">Add New Pot</button>',
    content: `<section class="cards-grid">${pots.length ? pots.map(potCard).join("") : emptyState("No pots yet", "Create a savings pot to track progress toward a goal.")}</section>`
  });
}
