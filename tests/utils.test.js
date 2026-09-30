import { test, assertEqual } from "./test-harness.js";
import { escapeHtml, formatCurrency, generateId, stableId, toMoney, formatDate, formatBillDate, getContextDate, isSameMonth, dateForContextDay, daysBetween, clamp, percentage, normalizePage } from "../src/core/utils.js";

test("escapeHtml converts HTML tags to safe text", () => {
  assertEqual(
    escapeHtml("<b>Ciao</b>"),
    "&lt;b&gt;Ciao&lt;/b&gt;"
  );
});

test("escapeHtml converts ampersands and quotation marks", () => {
  assertEqual(
    escapeHtml('Tom & "Jerry"'),
    "Tom &amp; &quot;Jerry&quot;"
  );
});

test("escapeHtml returns an empty string when the value is omitted", () => {
  assertEqual(escapeHtml(), "");
});

// TEST : generateId

test("generateId uses the supplied prefix", () => {
  const id = generateId("tnx");

  assertEqual(id.startsWith("tnx-"), true);
})


test("generateId produces different values", () => {
  const firstId = generateId("tnx");
  const secondId = generateId("tnx");
  assertEqual(firstId === secondId, false);
})


// TEST : stableId


test("stableId produces repeatable identifiers", () => {
  assertEqual(
    stableId("budget", "Entertainment"),
    stableId("budget", "Entertainment")
  );
});

test("stableId normalizes whitespace, uppercase letters, and symbols", () => {
  assertEqual(
    stableId("budget", " Dining Out! "),
    "budget-dining-out"
  );
});


// TEST : toMoney


test("toMoney rounds to two decimal places", () => {
  assertEqual(toMoney("10.129"), 10.13);
});

test("toMoney returns zero for non-numeric values", () => {
  assertEqual(toMoney("abc"), 0);
});


// TEST : formatCurrency


test("formatCurrency formats a number as currency", () => {
  assertEqual(formatCurrency(1234.5), "$1,234.50");

});


test("formatCurrency shows a plus sign when signed is true", () => {
  assertEqual(formatCurrency(50, { signed: true }), "+$50.00");
})

test("formatCurrency shows a minus sign when signed is true", () => {
  assertEqual(formatCurrency(-50, { signed: true }), "-$50.00");
});

test("formatCurrency compacts values over 1000 when compact is true", () => {
  assertEqual(formatCurrency(1234.5, { compact: true }), "$1,235");
});

// TEST : formatDate


test("formatDate formats an ISO date", () => {
  assertEqual(
    formatDate("2024-08-19T14:23:11.000Z"),
    "19 Aug 2024"
  );
});


// TEST : formatBillDate


test("formatBillDate uses st for 1, 21, and 31", () => {
  assertEqual(formatBillDate(1), "Monthly - 1st");
  assertEqual(formatBillDate(21), "Monthly - 21st");
  assertEqual(formatBillDate(31), "Monthly - 31st");
});

test("formatBillDate uses nd for 2 and 22", () => {
  assertEqual(formatBillDate(2), "Monthly - 2nd");
  assertEqual(formatBillDate(22), "Monthly - 22nd");
});

test("formatBillDate uses rd for 3 and 23", () => {
  assertEqual(formatBillDate(3), "Monthly - 3rd");
  assertEqual(formatBillDate(23), "Monthly - 23rd");
});

test("formatBillDate uses th for all other days", () => {
  assertEqual(formatBillDate(4), "Monthly - 4th");
  assertEqual(formatBillDate(11), "Monthly - 11th");
});


// TEST : getContextDate

test("getContextDate returns the latest transaction date", () => {
  const contextDate = getContextDate([
    { date: "2024-08-01T00:00:00.000Z" },
    { date: "2024-09-10T00:00:00.000Z" },
    { date: "2024-07-20T00:00:00.000Z" }
  ]);

  assertEqual(
    contextDate.toISOString(),
    "2024-09-10T00:00:00.000Z"
  );
});


test("getContextDate returns a Date when there are no transactions", () => {
  const contextDate = getContextDate([]);

  assertEqual(contextDate instanceof Date, true);
});


//TEST isSameMonth

test("isSameMonth returns true for the same month and year", () => {
  const contextDate = new Date("2024-08-19T00:00:00.000Z");

  assertEqual(
    isSameMonth("2024-08-01T00:00:00.000Z", contextDate),
    true
  );
});

test("isSameMonth returns false for a different month", () => {
  const contextDate = new Date("2024-08-19T00:00:00.000Z");

  assertEqual(
    isSameMonth("2024-09-01T00:00:00.000Z", contextDate),
    false
  );
});



//TEST dateForContextDay


test("dateForContextDay creates a date in the context month and year", () => {
  const contextDate = new Date("2024-08-19T00:00:00.000Z");

  assertEqual(
    dateForContextDay(5, contextDate).toISOString(),
    "2024-08-05T12:00:00.000Z"
  );
});

//TEST daysBetween


test("daysBetween calculates whole calendar days and ignores time", () => {
  const start = new Date("2024-08-19T18:30:00.000Z");
  const end = new Date("2024-08-21T02:00:00.000Z");

  assertEqual(daysBetween(start, end), 2);
});


test("daysBetween returns a negative value when end precedes start", () => {
  const start = new Date("2024-08-21T00:00:00.000Z");
  const end = new Date("2024-08-19T00:00:00.000Z");

  assertEqual(daysBetween(start, end), -2);
});


//TEST clamp


test("clamp preserves a value inside the range", () => {
  assertEqual(clamp(50, 0, 100), 50);
});

test("clamp raises a low value to the minimum", () => {
  assertEqual(clamp(-10, 0, 100), 0);
});

test("clamp lowers a high value to the maximum", () => {
  assertEqual(clamp(150, 0, 100), 100);
});


//TEST percentage

test("percentage calculates a rounded percentage", () => {
  assertEqual(percentage(25, 100), 25);
});

test("percentage returns zero when the total is zero", () => {
  assertEqual(percentage(25, 0), 0);
});

test("percentage clamps the result between 0 and 999", () => {
  assertEqual(percentage(-10, 100), 0);
  assertEqual(percentage(2000, 100), 999);
});


//TEST normalizePage


test("normalizePage converts a numeric string to a page number", () => {
  assertEqual(normalizePage("3"), 3);
});

test("normalizePage returns page one for invalid values", () => {
  assertEqual(normalizePage("abc"), 1);
  assertEqual(normalizePage("0"), 1);
  assertEqual(normalizePage("-5"), 1);
});
