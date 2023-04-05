import { chromium } from 'playwright';
import fs from 'fs';
import { parse as json2csv } from 'json2csv';

const results = [];
const errors = [];

const fetchPlant = async (context, { name, subcategory = null, category, url }) => {
  const page = await context.newPage();

  try {
    await page.goto(url, { timeout: 360000 });
    console.log('fetching', name, category, subcategory, url);

    const plant = {
      name,
      category,
      subcategory,
      url,
    };

    const rows = await page.$$('.rs-growing-time table tr');
    const plantInfo = await page.$('.fce_shop_inhalt_right_artikelnummer');
    const growingInfo = await page.$('.growingInfos');

    if (rows.length === 0) {
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

    if (growingInfo) {
      const paragraphs = await growingInfo.$$('p');
      for (const paragraph of paragraphs) {
        const strong = await paragraph.$('strong');
        if (strong) {
          let key = await strong.innerText();
          if (!key.includes(':')) {
            continue;
          }
          const text = await paragraph.innerText();
          const value = text.replace(key, '').trim();
          key = key.replace(':', '');
          plant[key] = value;
        }
      }
    }
    results.push(plant);
  } catch (error) {
    console.error('[ERROR] Error fetching plant', name, category, subcategory, url, error);
    errors.push({ name, category, subcategory, url, error });
  }
};

const fetchSubSublinks = async (context, { name, category, url }) => {
  console.log('[INFO] Fetching subsublinks', name, category, url);
  const pageSubSublinks = await context.newPage();
  await pageSubSublinks.goto(url);

  const subsublinks = await pageSubSublinks.$$eval(
    '.s_subnavi .s_subnavi_active .s_sub_subnavi .s_sub_sub_subnavi a',
    (links) =>
      links.map((link) => {
        console.log('link', link.innerText, link.href);
        return {
          name: link.innerText,
          url: link.href,
        };
      }),
  );

  console.log('[INFO] Found subsublinks', subsublinks.length);

  await pageSubSublinks.close();

  if (subsublinks.length > 0) {
    await Promise.all(
      subsublinks.map((subsublinks) =>
        fetchPlant(context, { ...subsublinks, subcategory: name, category }),
      ),
    );
  } else {
    await fetchPlant(context, { name, category, url });
  }
};

const fetchSublinks = async (browser, { category, url }) => {
  console.log('[INFO] Fetching sublinks', category, url);
  const context = await browser.newContext({
    maximumConcurrency: 20,
  });
  const pageSublinks = await context.newPage();

  await pageSublinks.goto(url);

  const sublinks = await pageSublinks.$$eval(
    '.s_subnavi .s_subnavi_active .s_sub_subnavi a',
    (links) =>
      links.map((link) => {
        return {
          name: link.innerText,
          url: link.href,
        };
      }),
  );

  console.log('[INFO] Found sublinks', sublinks.length);

  await pageSublinks.close();
  await Promise.all(sublinks.map((sublink) => fetchSubSublinks(context, { ...sublink, category })));
  await context.close();
};

const fetchAllPlants = async () => {
  console.log('[INFO] Fetching plants');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto('https://www.reinsaat.at/shop/EN/');

    const superlinks = await page.$$eval('.s_subnavi a', (links) =>
      links.map((link) => {
        return {
          category: link.innerText,
          url: link.href,
        };
      }),
    );
    console.log('[INFO] Found superlinks', superlinks.length);

    await Promise.all(superlinks.map((superlink) => fetchSublinks(browser, superlink)));
    await browser.close();
    console.log('[INFO] Done fetching plants');
    console.log('[INFO] Writing to CSV. Length:', results.length);
    writeToCsv(results, 'data/reinsaatRawData.csv');
    console.log('[INFO] Done writing to CSV');
  } catch (error) {
    console.error(error);
    await browser.close();
    console.log('[INFO] browser closed');
  } finally {
    if (errors.length > 0) {
      console.log('[INFO] Writing errors to CSV. Length:', errors.length);
      writeToCsv(errors, 'data/reinsaatErrors.csv');
      console.log('[INFO] Done writing errors to CSV');
    }
  }
};

function writeToCsv(plants, path) {
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
  fs.writeFileSync(path, csv);
}

fetchAllPlants();

// const test = async () => {
//   const browser = await chromium.launch();
//   await fetchSublinks(browser, {
//     category: 'Cucumbers',
//     // url: 'https://www.reinsaat.at/shop/EN/wild_flowers_seeds/',
//     url: 'https://www.reinsaat.at/shop/EN/cucumbers/',
//   });
//   console.log('results', results);
//   await browser.close();
// };

// test();
