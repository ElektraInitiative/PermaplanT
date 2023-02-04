import { test, expect } from '@playwright/test';
const csv = require('csvtojson');

import { chromium } from '@playwright/test';
import { parse } from 'json2csv';
import { writeFileSync } from 'fs';

const BASE_URL = 'https://practicalplants.org';

let jsonArray: any[] = [];

test.describe('Fetch plant list', () => {
    test.beforeEach(async ({}) => {
        jsonArray = await csv().fromFile('data/plants.csv');
    });

    test('Fetch list', async ({}) => {
        const browser = await chromium.launch({
            headless: true,
        });
        const context = await browser.newContext();
        let detailsArray = await Promise.all(
            jsonArray.map(async (plant) => {
                const page = await context.newPage();
                const details: Object = {};
                await page.goto(`${BASE_URL}${plant['url']}`);

                const plantDatatable = await page.$('div#plant-datatable');
                if (!plantDatatable) {
                    return;
                }
                const sections = await plantDatatable.$$('div.infobox-section');
                for (const section of sections) {
                    const content = await section.$('div.infobox-content');
                    const subSections = await content.$$('div.infobox-subsection');
                    await Promise.all(
                        subSections.map(async (subSection) => {
                            const subSectionTitle = await subSection.$('.infobox-title');
                            const subSectionTitleText = await subSectionTitle.innerText();
                            const subSectionContent = await subSection.$('.infobox-content');
                            const subSectionContentText = await subSectionContent.innerText();
                            if (subSectionContentText === '?' || subSectionContentText === '') {
                                details[subSectionTitleText] = null;
                            } else {
                                details[subSectionTitleText] = subSectionContentText;
                            }
                        }),
                    );
                }
                return details;
            }),
        );
        detailsArray = detailsArray.filter((item) => item !== undefined);
        const csv = parse(detailsArray);
        writeFileSync('data/detail.csv', csv);
    });
});
