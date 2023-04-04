import { chromium } from 'playwright';
import fs from 'fs';
import { parse as json2csv } from 'json2csv';

const fetchAllPlants = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.reinsaat.at/shop/DE/gurken/rs-gu-01.22_nishiki/');
  const results = [];
  const plant = {};

  const rows = await page.$$('.rs-growing-time table tr');
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

  results.push(plant);

  await browser.close();

  return results;
};

function writePlantsToCsv(plants) {
  if (!fs.existsSync('data')) {
    fs.mkdirSync('data');
  }
  const sanitizedPlants = plants.map((plant) => {
    for (const [key, value] of Object.entries(plant)) {
      plant[key] = value.map((v) => v.toString()).join(',');
    }
    return plant;
  });

  const csv = json2csv(sanitizedPlants);
  fs.writeFileSync('data/reinsaatRawData.csv', csv);
}

fetchAllPlants()
  .then((plants) => writePlantsToCsv(plants))
  .catch((error) => console.error(error));
