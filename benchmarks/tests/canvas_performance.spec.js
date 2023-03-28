import { playAudit } from 'playwright-lighthouse';
import playwright from 'playwright';
import { test } from '@playwright/test';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { parseAsync } from 'json2csv';

const { Pool } = require('pg');
const fs = require('fs');
const csv = require('csv-parser');

// Create a PostgreSQL pool
const pool = new Pool({
    user: 'permaplant',
    host: '127.0.0.1',
    database: 'permaplant',
    password: 'permaplant',
    port: 5432,
});

let browser;
let results = [];

const audit = async (testname, url) => {
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
    results.push({
        testname: testname,
        firstContentfulPaint: result.lhr.audits.metrics.details.items[0].firstContentfulPaint,
        largestContentfulPaint: result.lhr.audits.metrics.details.items[0].largestContentfulPaint,
        interactive: result.lhr.audits.metrics.details.items[0].interactive,
    });

    console.log(`Lighthouse report saved to ${reportFilename}`);
};

test.describe('Canvas performance audit', () => {
    test.beforeAll(async ({}) => {
        // Delete the data from the database
        try {
            await pool.query('DELETE FROM map');
        } catch (error) {}

        // Read the CSV file and insert the data into the database
        fs.createReadStream('map.csv')
            .pipe(csv())
            .on('data', async (row) => {
                const query = {
                    text: 'INSERT INTO map(id, detail) VALUES($1, $2)',
                    values: [row.id, row.detail],
                };
                try {
                    await pool.query(query);
                } catch (err) {
                    console.error(err);
                }
            })
            .on('end', () => {
                console.log('CSV file successfully processed');
                pool.end(); // close the pool
            });

        browser = await playwright['chromium'].launch({
            args: ['--remote-debugging-port=9222'],
        });
    });

    test.afterAll(async () => {
        await browser.close();
        const outputFilename = `report/${Date.now()}-lighthouse-results.csv`;
        const csvData = await parseAsync(results);

        console.log(csvData);
        fs.writeFileSync(outputFilename, csvData);

        console.log(`Lighthouse results saved to ${outputFilename}`);
    });

    test('empty canvas', async () => {
        const testname = 'empty_canvas';
        await audit(testname, 'http://localhost:5173/demo/1');
    });

    test('3 elements', async () => {
        const testname = '3_elements';
        await audit(testname, 'http://localhost:5173/demo/2');
    });

    test('3 circles', async () => {
        const testname = '3_circles';
        await audit(testname, 'http://localhost:5173/demo/4');
    });

    test('10 circles', async () => {
        const testname = '10_circles';
        await audit(testname, 'http://localhost:5173/demo/5');
    });

    test('100 circles', async () => {
        const testname = '100_circles';
        await audit(testname, 'http://localhost:5173/demo/6');
    });

    test('1000 circles', async () => {
        const testname = '1000_circles';
        await audit(testname, 'http://localhost:5173/demo/7');
    });
});
