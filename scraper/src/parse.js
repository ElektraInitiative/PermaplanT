import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { parse } from 'node-html-parser';
import { parse as json2csv } from 'json2csv';
import { config } from 'dotenv';
import axios from 'axios';

config();

const archivePath = process.env.PRACTICALPLANTSPATH;

function createDistinctFamilyDetails(details) {
  const detailsCopy = JSON.parse(JSON.stringify(details));
  const distinctFamilyDetails = [];
  const distinctFamilyList = [];
  detailsCopy.forEach((detail) => {
    const family = detail['Family'];
    if (!distinctFamilyList.includes(family)) {
      distinctFamilyList.push(family);
      Object.keys(detail).forEach((key) => {
        if (key !== 'Family') {
          detail[key] = null;
        }
      });
      distinctFamilyDetails.push(detail);
    }
  });
  return distinctFamilyDetails;
}

function createDistinctGenusDetails(details) {
  const detailsCopy = JSON.parse(JSON.stringify(details));
  const distinctGenusDetails = [];
  const distinctGenusList = [];

  detailsCopy.forEach((detail) => {
    const genus = detail['Genus'];
    if (!distinctGenusList.includes(genus)) {
      distinctGenusList.push(genus);
      Object.keys(detail).forEach((key) => {
        if (key !== 'Genus') {
          detail[key] = null;
        }
      });
      distinctGenusDetails.push(detail);
    }
  });
  return distinctGenusDetails;
}

async function fetchGermanName(binomialName) {
  try {
    const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${binomialName}&language=en&format=json`;
    const response = await axios.get(url);
    const data = response.data;
    const results = data.search;
    if (results.length === 0) {
      return null;
    }
    const result = results[0];
    const id = result.id;
    const url2 = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${id}&languages=de&format=json`;
    const response2 = await axios.get(url2);
    const data2 = response2.data;
    const entities = data2.entities;
    const entity = entities[id];
    const dewiki = await entity['sitelinks']['dewiki'];
    if (dewiki) {
      return dewiki.title;
    }
  } catch (error) {}
  return null;
}

function processData(details) {
  try {
    const mature_size = details['Mature Size']
      .replace('metres', '')
      .replace('meters', '')
      .replace('?', '');
    const arr = mature_size.split('x');
    const mature_size_height = arr[0]?.trim() || null;
    const mature_size_width = arr[1]?.trim() || null;
    if (isNaN(mature_size_height) || isNaN(mature_size_width)) {
      details['To check'] = details['To check']
        ? details['To check'] + ', Mature Size or Height'
        : 'Mature Size or Height';
    }
    details['Mature Size Height'] = mature_size_height;
    details['Mature Size Width'] = mature_size_width;
    delete details['Mature Size'];
  } catch (error) {
    console.log(error);
  }

  Object.keys(details).forEach((key) => {
    if (details[key] === '?') {
      details[key] = null;
    } else if (details[key] === 'None listed.') {
      details[key] = null;
    }

    if (details['Herbaceous or Woody'] === 'herbaceous' && details['Life Cycle'] === 'perennial') {
      details['Is Tree'] = true;
    }

    if (key == 'Environmental Tolerances' && details[key].includes('Nutritionally poor soil')) {
      details['Nutrition Demand'] = 'light feeder';
    }

    if (key == 'Binomial name' && details[key].split(' ').length > 2) {
      details['Is Variety'] = true;
      details['To check'] = details['To check']
        ? details['To check'] + ', Is Variety'
        : 'Is Variety';
    }
  });
}

function parseSinglePage(fileName) {
  const file = readFileSync(archivePath + '/wiki/' + fileName + '/index.html', 'utf8');
  const root = parse(file);
  const details = {
    'Folder Name': fileName,
    'Common Name': '',
    'Common Name DE': '',
    Subfamily: '',
    'To check': null,
    'Is Tree': null,
    'Mature Size Height': null,
    'Mature Size Width': null,
    'Nutrition Demand': null,
    'Article Last Modified At': null,
    'Is Variety': null,
  };
  const errors = {};
  try {
    const commonNames = root.querySelectorAll('#common-name li');
    details['Common Name'] = commonNames.map((node) => node.innerText).join(', ');
  } catch (error) {
    errors['Folder Name'] = fileName;
    errors['Common Name'] = 'Not Found';
  }
  try {
    const plantDatatable = root.querySelector('#plant-datatable');
    const subsections = plantDatatable.querySelectorAll('.infobox-subsection');

    subsections.forEach((subsection) => {
      const subsectionTitle = subsection.querySelector('.infobox-title').innerText;
      const subsectionData = subsection.querySelector('.infobox-content').innerText;
      details[subsectionTitle] = subsectionData;
    });
  } catch (error) {
    errors['Plant Datatable'] = 'Not Found';
    throw errors;
  }

  try {
    const factTable = root.querySelector('.smwfacttable');
    if (!factTable) {
      throw new Error('No Fact Table');
    }
    const facts = factTable.querySelectorAll('tr');
    facts.forEach((fact) => {
      const factTitle = fact.querySelector('.smwpropname')?.innerText;
      const factData = fact.querySelector('.smwprops')?.textContent;
      if (factTitle?.includes('Has&#160;drought&#160;tolerance')) {
        const isTolerant = factData.replace('+', '').trim();
        if (isTolerant === 'Tolerant') {
          details['Has drought tolerance'] = true;
        } else if (isTolerant === 'Intolerant') {
          details['Has drought tolerance'] = false;
        }
      }
      if (factTitle?.includes('Tolerates&#160;wind')) {
        const isTolerant = factData.replace('+', '').trim();
        if (isTolerant === 'Yes') {
          details['Tolerates wind'] = true;
        } else if (isTolerant === 'No' || isTolerant === 'FALSE') {
          details['Tolerates wind'] = false;
        }
      }
    });
  } catch (error) {
    // The following error can occur if there is no fact table on the page
    // errors['Fact Table'] = 'Not Found';
  }

  try {
    const footerInfo = root.querySelector('#mw-footer-info') || root.querySelector('#footer-info');
    const listElements = footerInfo.querySelectorAll('li');
    listElements.forEach((listElement) => {
      const text = listElement.innerText;
      if (text.includes('last modified')) {
        // Use a regular expression to extract the date and time strings
        const datePattern = /(\d{1,2}\s\w+\s\d{4}), at (\d{1,2}):(\d{2})/;
        const matches = datePattern.exec(text);

        const date = new Date(matches[1]);
        const hours = parseInt(matches[2], 10);
        const minutes = parseInt(matches[3], 10);
        date.setHours(hours);
        date.setMinutes(minutes);
        details['Article Last Modified At'] = date.toISOString();
      }
    });
  } catch (error) {
    // The following error can occur if there is no footer info on the page
    // errors['Footer Info'] = 'Not Found';
  }

  const plantSections = {
    'Plant References': '#article-references .reference-text',
    // 'Plant Uses': '#plant-uses',
    // 'Plant Functions': '#plant-functions',
    // 'Plant Propagation': '#plant-propagation',
    // 'Plant Cultivation': '#plant-cultivation',
    // 'Plant Crops': '#plant-crops',
    // 'Plant Problems': '#plant-problems',
    // 'Plant Interactions': '#plant-interactions',
    // 'Plant Polycultures': '#plant-polycultures',
    // 'Plant Descedants': '#plant-descendants',
  };

  Object.keys(plantSections).forEach((section) => {
    try {
      const sectionNode = root.querySelectorAll(plantSections[section]);
      details[section] = sectionNode.map((node) => node.innerText).join('///ref///');
    } catch (error) {
      errors[section] = 'Not Found';
    }
  });

  processData(details);

  return details;
}

async function parseAllPages() {
  console.log('Parsing all pages');
  const files = readdirSync(archivePath + '/wiki');
  const errorsArray = [];

  const plantFiles = files.filter(
    (fileName) =>
      fileName !== '.DS_Store' &&
      fileName !== 'A-Z_of_all_plants' &&
      fileName !== 'A-Z_of_common_names',
  );

  const details = await Promise.all(
    plantFiles.map(async (fileName, index) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, index * 50));
        console.log('Parsing', fileName);
        const fileDetails = parseSinglePage(fileName);
        const germanCommonName = await fetchGermanName(fileDetails['Binomial name']);
        fileDetails['Common Name DE'] = germanCommonName;
        return fileDetails;
      } catch (errors) {
        errorsArray.push(errors);
        return null;
      }
    }),
  );
  const filteredDetails = details.filter((detail) => detail !== null);

  console.log('Finished parsing all pages');
  const distinctGenusDetails = createDistinctGenusDetails(filteredDetails);
  const distinctFamilyDetails = createDistinctFamilyDetails(filteredDetails);

  if (!existsSync('data')) {
    mkdirSync('data');
  }

  console.log('Writing to CSV');
  const csv = json2csv(filteredDetails);
  writeFileSync('data/detail.csv', csv);

  const errorsCsv = json2csv(errorsArray);
  writeFileSync('data/errors.csv', errorsCsv);

  const distinctGenusCsv = json2csv(distinctGenusDetails);
  writeFileSync('data/distinctGenus.csv', distinctGenusCsv);

  const distinctFamilyCsv = json2csv(distinctFamilyDetails);
  writeFileSync('data/distinctFamily.csv', distinctFamilyCsv);

  console.log('Parsed ' + filteredDetails.length + ' pages');
  console.log('Encountered ' + errorsArray.length + ' errors');
}

parseAllPages();
