import { test, expect } from '@playwright/test';

import { chromium } from '@playwright/test';
import { parse } from 'json2csv';
import { writeFileSync } from 'fs';

test.describe('Fetch plant list', () => {
    test('Fetch list', async ({}) => {
        const browser = await chromium.launch({
            headless: true,
        });
        const data: any[] = [];
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto('https://practicalplants.org/wiki/a-z_of_all_plants/');
        const articleContent = await page.$('div.article-content');
        const links = await articleContent.$$('li a');
        for (const link of links) {
            const href = await link.getAttribute('href');
            const text = await link.innerText();
            data.push({ href, text });
        }
        const csv = parse(data);
        writeFileSync('data/plants.csv', csv);
    });
});
