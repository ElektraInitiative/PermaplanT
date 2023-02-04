import { test, expect } from '@playwright/test';

import { chromium } from '@playwright/test';
import { parse } from 'json2csv';
import { writeFileSync } from 'fs';

test.describe('Fetch plant list', () => {
    test('Fetch list', async ({}) => {
        const browser = await chromium.launch({
            headless: true,
        });
        const data: Object = {};
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto('https://practicalplants.org/wiki/solanum_lycopersicum/');
        const plantDatatable = await page.$('div#plant-datatable');
        const sections = await plantDatatable.$$('div.infobox-section');
        for (const section of sections) {
            // const title = await section.$('.infobox-title');
            const content = await section.$('div.infobox-content');
            const subSections = await content.$$('div.infobox-subsection');
            const contentText = await Promise.all(
                subSections.map(async (subSection) => {
                    const subSectionTitle = await subSection.$('.infobox-title');
                    const subSectionTitleText = await subSectionTitle.innerText();
                    const subSectionContent = await subSection.$('.infobox-content');
                    const subSectionContentText = await subSectionContent.innerText();
                    data[subSectionTitleText] = subSectionContentText;
                }),
            );
        }
        const csv = parse(data);
        writeFileSync('data/detail.csv', csv);
    });
});
