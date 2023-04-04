import { chromium } from 'playwright';
import fs from 'fs';
import { parse as json2csv } from 'json2csv';

const results = [];

const fetchPlant = async (browser, { name, url }) => {
  const page = await browser.newPage();
  await page.goto(url);
  const plant = {
    name,
    url,
  };

  const rows = await page.$$('.rs-growing-time table tr');
  const plantInfo = await page.$('.fce_shop_inhalt_right_artikelnummer');

  if (rows.length === 0 && !plantInfo) {
    return;
  }

  if (rows.length > 0) {
    for (const row of rows) {
      const typeLabelTd = await row.$('td.type-lable');
      if (!typeLabelTd) {
        continue;
      }
      const typeLabel = await typeLabelTd.innerText();
      plant[typeLabel] = [];

      const tds = await row.$$('td');
      for (let i = 0; i < tds.length; i++) {
        const td = tds[i];
        const backgroundColor = await td.getAttribute('style');
        if (backgroundColor && backgroundColor !== 'background-color: none;') {
          plant[typeLabel].push(i);
        }
      }
    }
  }

  if (plantInfo) {
    const innerText = await plantInfo.innerText();

    const regex = /(\w+[^:]*):\s*([^\n]*)/g;
    let matches;
    while ((matches = regex.exec(innerText)) !== null) {
      plant[matches[1].trim()] = matches[2].trim();
    }
  }

  results.push(plant);
};

const fetchSublinks = async (browser, url) => {
  const page = await browser.newPage();
  await page.goto(url);

  const sublinks = await page.$$eval('.s_subnavi .s_subnavi_active .s_sub_subnavi a', (links) =>
    links.map((link) => {
      return {
        name: link.innerText,
        url: link.href,
      };
    }),
  );

  console.log(sublinks);

  await Promise.all(sublinks.map((sublink) => fetchPlant(browser, sublink)));
};

const fetchAllPlants = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.reinsaat.at/shop/EN/');

  const superlinks = await (
    await page.$$eval('.s_subnavi a', (links) => links.map((link) => link.href))
  ).slice(0, 10);

  await Promise.all(superlinks.map((superlink) => fetchSublinks(browser, superlink)));

  await browser.close();

  writePlantsToCsv(results);
};

function writePlantsToCsv(plants) {
  if (!fs.existsSync('data')) {
    fs.mkdirSync('data');
  }
  const sanitizedPlants = plants.map((plant) => {
    for (const [key, value] of Object.entries(plant)) {
      if (typeof key === 'object' && !Array.isArray(key) && key !== null) {
        plant[key] = value.map((v) => v.toString()).join(',');
      }
    }
    return plant;
  });

  const csv = json2csv(sanitizedPlants);
  fs.writeFileSync('data/reinsaatRawData.csv', csv);
}

fetchAllPlants();
