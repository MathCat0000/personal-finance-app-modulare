const tests = [];
const results = [];

export function test(name, callback) {
  tests.push({ name, callback });
}

export function assertEqual(received, expected) {
  if (received !== expected) throw new Error(`Expected: ${expected}. Received: ${received}`);
}

export function assertDeepEqual(received, expected) {
  assertEqual(JSON.stringify(received), JSON.stringify(expected));
}

export function assertIncludes(received, expected) {
  if (!String(received).includes(expected)) throw new Error(`Expected "${received}" to include "${expected}".`);
}

export function assertThrows(callback, expectedMessage) {
  let message = "";
  try { callback(); } catch (error) { message = error.message; }
  assertEqual(message, expectedMessage);
}

export async function runTests() {
  results.length = 0;
  for (const { name, callback } of tests) {
    try {
      await callback();
      results.push({ name, status: "PASS" });
    } catch (error) {
      results.push({ name, status: "FAIL", error: error?.message || String(error) });
    }
  }
  return results;
}

export async function renderResults() {
  await runTests();
  const app = document.querySelector("#test-results");
  app.innerHTML = results.map((result) => result.status === "PASS"
    ? `<p>PASS - ${result.name}</p>`
    : `<p>FAIL - ${result.name}: ${result.error}</p>`).join("");
  return results;
}
