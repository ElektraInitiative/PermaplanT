import { chromium } from 'playwright';
import fs from 'fs';
import { parse as json2csv } from 'json2csv';
import pLimit from 'p-limit';

const results = [];
const resultsDE = [];
const errors = [];
const limit = pLimit(1);
const limitSubSublinks = pLimit(3);

/**
 * Fetch the data of a plant.
 */
const fetchPlant = async (
  context,
  resultsArray,
  { name, category = null, subcategory = null, subsubsubcategory = null, url },
) => {
  const page = await context.newPage();

  try {
    await page.goto(url, { timeout: 360000 });
    console.log('fetching', name, category, subcategory, subsubsubcategory, url);

    const plant = {
      name,
      category,
      subcategory,
      subsubsubcategory,
      url,
    };

    const rows = await page.$$('.rs-growing-time table tr');
    const plantInfo = await page.$('.fce_shop_inhalt_right_artikelnummer');
    const growingInfo = await page.$('.growingInfos');
    const productIcons = await page.$('.product-icons.clearfix');

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

    if (productIcons) {
      const isSuitableForCultivation = !!(await productIcons.$(
        'img[src="/shop/Bibliothek/medial_lib/product_icons/traktor.svg"]',
      ));
      plant['Suitable for professional cultivation'] = isSuitableForCultivation;
    }

    resultsArray.push(plant);
  } catch (error) {
    console.error('[ERROR] Error fetching plant', name, category, subcategory, url, error);
    errors.push({ name, category, subcategory, url, error });
  }
};

/**
 *  Fetch the subsubsublinks(3rd level) of a category.
 */
const fetchThirdLevel = async (context, resultsArray, { name, category, subcategory, url }) => {
  // console.log('[INFO] Fetching subsubsublinks', name, category, url);
  const page = await context.newPage();
  await page.goto(url);

  const subsubsublinks = await page.$$eval(
    '.s_subnavi .s_subnavi_active .s_sub_subnavi .s_sub_sub_subnavi .submenu_3 a',
    (links) =>
      links.map((link) => {
        return {
          name: link.innerText,
          url: link.href,
        };
      }),
  );

  await page.close();
  if (subsubsublinks.length > 0) {
    await Promise.all(
      subsubsublinks.map((subsubsublink) =>
        fetchPlant(context, resultsArray, {
          ...subsubsublink,
          subcategory,
          category,
          subsubsubcategory: name,
        }),
      ),
    );
  } else {
    await fetchPlant(context, resultsArray, { name, category, subcategory, url });
  }
};

/**
 * Fetch the subsublinks(2nd level) of a category.
 *
 * @param {*} context
 * @param {*} resultsArray
 * @param {*} param2
 */
const fetchSubSublinks = async (context, resultsArray, { name, category, url }) => {
  // console.log('[INFO] Fetching subsublinks', name, category, url);
  const page = await context.newPage();
  await page.goto(url);

  const subsublinks = await page.$$eval(
    '.s_subnavi .s_subnavi_active .s_sub_subnavi .s_sub_sub_subnavi a',
    (links) =>
      links.map((link) => {
        return {
          name: link.innerText,
          url: link.href,
        };
      }),
  );

  await page.close();

  if (subsublinks.length > 0) {
    await Promise.all(
      subsublinks.map((subsublinks) =>
        fetchThirdLevel(context, resultsArray, { ...subsublinks, subcategory: name, category }),
      ),
    );
  } else {
    await fetchPlant(context, resultsArray, { name, category, url });
  }
};

/**
 * Fetch the sublinks(1st level) of a category.
 */
const fetchSublinks = async (browser, resultsArray, { category, url }) => {
  // console.log('[INFO] Fetching sublinks', category, url);
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(url);

  const sublinks = await page.$$eval('.s_subnavi .s_subnavi_active .s_sub_subnavi a', (links) =>
    links.map((link) => {
      return {
        name: link.innerText,
        url: link.href,
      };
    }),
  );

  await page.close();
  await Promise.all(
    sublinks.map((sublink) => {
      return limitSubSublinks(() =>
        fetchSubSublinks(context, resultsArray, { ...sublink, category }),
      );
    }),
  );
  await context.close();
};

/**
 * Fetches all plants from the website.
 *
 * Collect all superlinks i.e. categories from the navigation bar.
 * Since the subcategories are loaded dynamically, we need to open each superlink in a new page.
 * Finally, write the results to a CSV file.
 *
 * @param {*} rootUrl
 * @param {*} outputCsvPath
 * @param {*} errorsCsvPath
 * @param {*} resultsArray
 */
const fetchAllPlants = async (rootUrl, outputCsvPath, errorsCsvPath, resultsArray) => {
  console.log('[INFO] Fetching plants');
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage();
    await page.goto(rootUrl);

    const superlinks = await page.$$eval('.s_subnavi a', (links) =>
      links.map((link) => {
        return {
          category: link.innerText,
          url: link.href,
        };
      }),
    );
    console.log('[INFO] Found superlinks', superlinks.length);
    await page.close();

    await Promise.all(
      superlinks.map((superlink) => {
        return limit(() => fetchSublinks(browser, resultsArray, superlink));
      }),
    );
    await browser.close();
    console.log('[INFO] Done fetching plants');
    console.log('[INFO] Writing to CSV. Length:', resultsArray.length);
    writeToCsv(resultsArray, outputCsvPath);
    console.log('[INFO] Done writing to CSV');
  } catch (error) {
    console.error(error);
    await browser.close();
    console.log('[INFO] browser closed');
  } finally {
    if (errors.length > 0) {
      console.log('[INFO] Writing errors to CSV. Length:', errors.length);
      writeToCsv(errors, errorsCsvPath);
      console.log('[INFO] Done writing errors to CSV');
    }
  }
};

function writeToCsv(plants, path) {
  if (!fs.existsSync('data')) {
    fs.mkdirSync('data');
  }
  const sanitizedPlants = plants.map((plant) => {
    const sanitizedPlant = {};
    for (const [key, value] of Object.entries(plant)) {
      if (typeof key === 'object' && !Array.isArray(key) && key !== null) {
        plant[key] = value.map((v) => v.toString()).join(',');
      }
      sanitizedPlant[key.trim()] = value;
    }
    return sanitizedPlant;
  });

  const csv = json2csv(sanitizedPlants);
  fs.writeFileSync(path, csv);
}

/**
 * Fetch both languages
 */
const fetchReinsaat = async () => {
  await fetchAllPlants(
    'https://www.reinsaat.at/shop/EN/',
    'data/reinsaatRawDataEN.csv',
    'data/reinsaatErrorsEN.csv',
    results,
  );
  await fetchAllPlants(
    'https://www.reinsaat.at/shop/DE',
    'data/reinsaatRawDataDE.csv',
    'data/reinsaatErrorsDE.csv',
    resultsDE,
  );
};

fetchReinsaat();
