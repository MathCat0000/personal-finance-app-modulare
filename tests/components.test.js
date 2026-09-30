import { test, assertIncludes, assertEqual } from "./test-harness.js";
import { emptyState } from "../src/components/emptyState.js";
import { optionList } from "../src/components/formControls.js";
import { paginationControls } from "../src/components/paginationControls.js";
import { progressBar } from "../src/components/summaryCard.js";
import { transactionLine } from "../src/components/transactionLine.js";

test("emptyState escapes text inserted into HTML", () => {
  assertIncludes(emptyState("<script>", "Nessun dato"), "&lt;script&gt;");
});

test("optionList selects the requested value", () => {
  assertIncludes(optionList(["Bills", "General"], "Bills"), 'value="Bills" selected');
});

test("progressBar visually clamps percentage to 100", () => {
  assertIncludes(progressBar(250, "#000"), "width:100%");
});

test("paginationControls disables Prev on the first page", () => {
  const html = paginationControls({ currentPage: 1, totalPages: 3, hasPrev: false, hasNext: true }, "transactions");
  assertIncludes(html, 'data-page="0" disabled');
});

test("transactionLine formats the name and amount", () => {
  const html = transactionLine({ id: "t1", avatar: "avatar.jpg", name: "Rent & Home", category: "Bills", date: "2024-08-19T00:00:00Z", amount: -500 });
  assertIncludes(html, "Rent &amp; Home");
  assertIncludes(html, "-$500.00");
  assertEqual(html.includes("data-modal"), false);
});
