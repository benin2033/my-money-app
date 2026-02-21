/**
 * E2E sync verification for money-app at http://localhost:5500/index.html
 * Run: npx playwright install chromium && node e2e-sync-verify.mjs
 */
import { chromium } from "playwright";

const BASE = "http://localhost:5500/index.html";
const STORAGE_KEYS = ["money-app-records-v1", "money-app-categories-v1", "money-app-projects-v1"];

const results = { steps: [], consoleErrors: [], networkErrors: [], itemNames: { A: null, B_OFFLINE: null } };

function log(msg) {
  console.log(msg);
}

function fail(step, reason) {
  results.steps.push({ step, pass: false, reason });
  log(`  [FAIL] ${reason}`);
}

function pass(step) {
  results.steps.push({ step, pass: true });
  log(`  [PASS]`);
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

async function addRecord(page, itemName, amount = 1) {
  await page.fill("#date", todayStr());
  await page.click("#typeIncomeBtn");
  await page.fill("#itemName", itemName);
  await page.selectOption("#category", { index: 0 });
  await page.fill("#amount", String(amount));
  await page.click("button[type=submit].btn-primary");
  await page.waitForTimeout(300);
}

function recordVisible(page, name) {
  return page.locator("#recordBody").getByText(name, { exact: false }).isVisible();
}

async function clearStorage(page) {
  await page.evaluate((keys) => {
    keys.forEach((k) => localStorage.removeItem(k));
  }, STORAGE_KEYS);
}

async function run() {
  log("E2E Sync Verification");
  log("====================");

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  context.setDefaultTimeout(15000);

  const consoleErrors = [];
  const networkErrors = [];
  context.on("page", (p) => {
    p.on("console", (msg) => {
      const type = msg.type();
      const text = msg.text();
      if (type === "error") consoleErrors.push(text);
    });
  });

  const page = await context.newPage();
  page.on("requestfailed", (req) => {
    networkErrors.push(`${req.url()} - ${req.failure()?.errorText || "failed"}`);
  });

  try {
    // --- Step 1: Open page and ensure ready ---
    log("\n1) Open page and ensure ready.");
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.waitForSelector("#recordBody", { state: "visible" });
    await page.waitForSelector("#recordForm", { state: "visible" });
    pass(1);

    // --- Step 2: Add unique online record A with timestamp in name; confirm visible ---
    log("\n2) Add unique online record A with timestamp in name; confirm visible.");
    const nameA = `A_${Date.now()}`;
    results.itemNames.A = nameA;
  await addRecord(page, nameA);
    const visibleA = await recordVisible(page, nameA);
    if (!visibleA) {
      fail(2, `Record "${nameA}" not visible after add`);
    } else {
      pass(2);
    }

    // --- Step 3: Reload and ensure A still present ---
    log("\n3) Reload and ensure A still present.");
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForSelector("#recordBody", { state: "visible" });
    const visibleAAfterReload = await recordVisible(page, nameA);
    if (!visibleAAfterReload) {
      fail(3, `Record "${nameA}" not visible after reload`);
    } else {
      pass(3);
    }

    // --- Step 4: Clear localStorage keys ---
    log("\n4) Clear localStorage keys.");
    await clearStorage(page);
    pass(4);

    // --- Step 5: Reload and verify A restored from cloud ---
    log("\n5) Reload and verify A restored from cloud.");
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    const visibleAFromCloud = await recordVisible(page, nameA);
    if (!visibleAFromCloud) {
      fail(5, `Record "${nameA}" not restored from cloud after clearing storage`);
    } else {
      pass(5);
    }

    // --- Step 6: Offline flow ---
    log("\n6) Offline: go offline -> add B_OFFLINE -> verify visible -> go online -> wait 5s -> reload -> verify B_OFFLINE.");
    await context.setOffline(true);
    await page.waitForTimeout(500);
    const nameB = "B_OFFLINE_" + Date.now();
    results.itemNames.B_OFFLINE = nameB;
    await addRecord(page, nameB);
    const visibleBOffline = await recordVisible(page, nameB);
    if (!visibleBOffline) {
      fail(6, `Record "${nameB}" not visible after offline add`);
    } else {
      await context.setOffline(false);
      await page.waitForTimeout(5000);
      await page.reload({ waitUntil: "networkidle" });
      await page.waitForTimeout(2000);
      const visibleBAfterOnline = await recordVisible(page, nameB);
      if (!visibleBAfterOnline) {
        fail(6, `Record "${nameB}" not visible after going online and reload`);
      } else {
        pass(6);
      }
    }
    await context.setOffline(false);

    // --- Step 7: Strong cloud check ---
    log("\n7) Clear same localStorage keys -> reload -> verify both A and B_OFFLINE restored from cloud.");
    await clearStorage(page);
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    const hasA = await recordVisible(page, nameA);
    const hasB = await recordVisible(page, nameB);
    if (!hasA || !hasB) {
      fail(7, `Cloud restore: A=${hasA}, B_OFFLINE=${hasB}`);
    } else {
      pass(7);
    }
  } catch (err) {
    log(`\n[ERROR] ${err.message}`);
    results.steps.push({ step: "run", pass: false, reason: err.message });
  } finally {
    results.consoleErrors = consoleErrors;
    results.networkErrors = networkErrors;
    await browser.close();
  }

  // --- Report ---
  log("\n========== REPORT ==========");
  log("Item names: A = " + (results.itemNames.A || "N/A") + ", B_OFFLINE = " + (results.itemNames.B_OFFLINE || "N/A"));
  log("\nSteps:");
  results.steps.forEach((s) => {
    log("  Step " + s.step + ": " + (s.pass ? "PASS" : "FAIL" + (s.reason ? " - " + s.reason : "")));
  });
  if (results.consoleErrors.length) {
    log("\nConsole errors:");
    results.consoleErrors.forEach((e) => log("  " + e));
  }
  if (results.networkErrors.length) {
    log("\nNetwork errors:");
    results.networkErrors.forEach((e) => log("  " + e));
  }
  const allPass = results.steps.every((s) => s.pass);
  process.exit(allPass ? 0 : 1);
}

run();
