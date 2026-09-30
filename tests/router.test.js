import { test, assertEqual } from "./test-harness.js";
import { parseHashParams, setHash } from "../src/router/router.js";

test("parseHashParams reads parameters from the hash", () => {
  assertEqual(
    JSON.stringify(parseHashParams("#/transactions?search=rent&page=2")),
    JSON.stringify({ search: "rent", page: "2" })
  );
});

test("parseHashParams returns an empty object when there are no parameters", () => {
  assertEqual(
    JSON.stringify(parseHashParams("#/transactions")),
    JSON.stringify({})
  );
});

test("setHash writes the path and valid parameters", () => {
  setHash("#/transactions", {
    search: "rent",
    category: "",
    page: 2
  });

  assertEqual(
    window.location.hash,
    "#/transactions?search=rent&page=2"
  );
});

test("setHash writes only the path when there are no parameters", () => {
  setHash("#/overview");

  assertEqual(window.location.hash, "#/overview");
});
