import { playAudit } from 'playwright-lighthouse';
import playwright from 'playwright';
import { test } from '@playwright/test';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { parseAsync } from 'json2csv';

const fs = require('fs');

let browser;
const results = [];
const results_shapes = [];

const audit = async (testname, url, result_arr) => {
    console.log('Starting Lighthouse audit for ' + testname);
    const page = await browser.newPage();
    await page.goto(url);

    const result = await playAudit({
        page: page,
        port: 9222,
        thresholds: {
            performance: 0,
        },
    });

    if (!existsSync('report')) {
        mkdirSync('report');
    }

    const reportFilename = `report/${testname}-report.json`;
    writeFileSync(reportFilename, JSON.stringify(result.lhr, null, 2));
    result_arr.push({
        testname: testname,
        firstContentfulPaint: result.lhr.audits.metrics.details.items[0].firstContentfulPaint,
        interactive: result.lhr.audits.metrics.details.items[0].interactive,
    });

    console.log(`Lighthouse report saved to ${reportFilename}`);
};

test.describe('Canvas performance audit', () => {
    test.beforeAll(async ({}) => {
        browser = await playwright['chromium'].launch({
            args: ['--remote-debugging-port=9222'],
        });
    });

    test.afterAll(async () => {
        await browser.close();
        const outputFilename = `report/${Date.now()}-lighthouse-results.csv`;
        const csvData = await parseAsync(results);

        fs.writeFileSync(outputFilename, csvData);

        console.log(`Lighthouse results saved to ${outputFilename}`);
    });

    test('empty canvas', async () => {
        const testname = 'empty canvas';
        await audit(testname, 'http://localhost:5173/demo/1', results);
    });

    test('3 elements', async () => {
        const testname = '3 elements';
        await audit(testname, 'http://localhost:5173/demo/2', results);
    });

    test('3 circle of same shape', async () => {
        const testname = '3 circles of same shape';
        await audit(testname, 'http://localhost:5173/demo/3', results);
    });

    test('100 circles', async () => {
        const testname = '100 circles';
        await audit(testname, 'http://localhost:5173/demo/4', results);
    });

    test('1000 circles', async () => {
        const testname = '1000 circles';
        await audit(testname, 'http://localhost:5173/demo/5', results);
    });

    test('10000 circles with 1 layer', async () => {
        const testname = '10000 circles with 1 layer';
        await audit(testname, 'http://localhost:5173/demo/6', results);
    });

    test('10000 circles with 10 layer', async () => {
        const testname = '10000 circles with 10 layer';
        await audit(testname, 'http://localhost:5173/demo/7', results);
    });
});

test.describe('Canvas performance audit of different shapes', () => {
    test.beforeAll(async ({}) => {
        browser = await playwright['chromium'].launch({
            args: ['--remote-debugging-port=9222'],
        });
    });

    test.afterAll(async () => {
        await browser.close();
        const outputFilename = `report/${Date.now()}-lighthouse-results-shapes.csv`;
        const csvData = await parseAsync(results_shapes);

        fs.writeFileSync(outputFilename, csvData);

        console.log(`Lighthouse results saved to ${outputFilename}`);
    });

    test('100 circles', async () => {
        const testname = '100 circles';
        await audit(testname, 'http://localhost:5173/demo/4', results_shapes);
    });

    test('100 stars', async () => {
        const testname = '100 stars';
        await audit(testname, 'http://localhost:5173/demo/8', results_shapes);
    });

    test('100 rectangles', async () => {
        const testname = '100 rectangles';
        await audit(testname, 'http://localhost:5173/demo/9', results_shapes);
    });

    test('100 polygons', async () => {
        const testname = '100 polygons';
        await audit(testname, 'http://localhost:5173/demo/10', results_shapes);
    });
});
