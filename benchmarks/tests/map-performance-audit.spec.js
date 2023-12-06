import { playAudit } from "playwright-lighthouse";
import playwright from "playwright";
import { test } from "@playwright/test";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { parseAsync } from "json2csv";

const fs = require("fs");

let browser;
const results = [];

const audit = async (testname, url, result_arr) => {
  console.log("Starting Lighthouse audit for " + testname);
  const page = await browser.newPage();
  await page.goto(url);

  const result = await playAudit({
    page: page,
    port: 9222,
    thresholds: {
      performance: 0,
    },
  });

  if (!existsSync("report")) {
    mkdirSync("report");
  }

  const reportFilename = `report/${testname}-report.json`;
  writeFileSync(reportFilename, JSON.stringify(result.lhr, null, 2));
  result_arr.push({
    testname: testname,
    firstContentfulPaint:
      result.lhr.audits.metrics.details.items[0].firstContentfulPaint,
    interactive: result.lhr.audits.metrics.details.items[0].interactive,
  });

  console.log(`Lighthouse report saved to ${reportFilename}`);
};

test.describe("Map canvas performance audit", () => {
  test.beforeAll(async ({}) => {
    browser = await playwright["chromium"].launch({
      args: ["--remote-debugging-port=9222"],
    });
  });

  test("Map page lighthouse audit", async () => {
    const testname = "map";
    const page = await browser.newPage();
    await page.goto("http://localhost:5173/");

    await page.getByText(/(Log in|Anmelden)/).click();
    await page.getByLabel("Username or email").fill("adi");
    await page.getByLabel("Password").fill("1234");
    await page.getByRole("button", { name: "Sign In" }).click();

    await audit(testname, "http://localhost:5173/map", results);

    await browser.close();
    const outputFilename = `report/${Date.now()}-lighthouse-results.csv`;
    const csvData = await parseAsync(results);

    fs.writeFileSync(outputFilename, csvData);

    console.log(`Lighthouse results saved to ${outputFilename}`);
  });
});
