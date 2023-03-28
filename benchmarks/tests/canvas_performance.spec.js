import { playAudit } from 'playwright-lighthouse';
import playwright from 'playwright';
import { test } from '@playwright/test';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

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

test.describe('Canvas performance audit', () => {
    test.beforeAll(async ({ browserName }) => {
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
    });

    test('measure page performance', async () => {
        console.log('Starting Lighthouse audit...');
        const browser = await playwright['chromium'].launch({
            args: ['--remote-debugging-port=9222'],
        });
        const page = await browser.newPage();
        await page.goto('http://localhost:5173/demo/1');

        const result = await playAudit({
            page: page,
            port: 9222,
            thresholds: {
                performance: 0.9,
            },
        });

        if (!existsSync('report')) {
            mkdirSync('report');
        }

        const reportFilename = `report/${Date.now()}-report.json`;
        writeFileSync(reportFilename, JSON.stringify(result.lhr, null, 2));

        console.log(`Lighthouse report saved to ${reportFilename}`);

        await browser.close();
    });
});
