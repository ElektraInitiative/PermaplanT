import { playAudit } from 'playwright-lighthouse';
import playwright from 'playwright';
import { test } from '@playwright/test';
import { writeFileSync } from 'fs';

test.describe('audit example', () => {
    test('open browser', async () => {
        const browser = await playwright['chromium'].launch({
            args: ['--remote-debugging-port=9222'],
        });
        const page = await browser.newPage();
        await page.goto('http://localhost:5173/demo');

        const result = await playAudit({
            page: page,
            port: 9222,
            thresholds: {
                performance: 0.9,
            },
        });

        const reportFilename = `${Date.now()}-report.json`;
        writeFileSync(reportFilename, JSON.stringify(result.lhr, null, 2));

        console.log(`Lighthouse report saved to ${reportFilename}`);

        await browser.close();
    });
});
