import fs from 'fs';
import { parse as json2csv } from 'json2csv';
import csv from 'csvtojson';
import permapeopleColumnMapping from './helpers/column_mapping_permapeople.js';
import { sanitizeColumnNames } from './helpers/helpers.js';

function getSoilPH(pH) {
  // If pH is a range, split it into two numbers and calculate the average
  if (pH.includes('-')) {
    const [min, max] = pH.split('-').map(Number);
    pH = (min + max) / 2;
  } else if (pH.includes('–')) {
    // Handle em dash character
    const [min, max] = pH.split('–').map(Number);
    pH = (min + max) / 2;
  } else if (pH.includes('<')) {
    // Handle less than symbol
    pH = Number(pH.slice(1)) - 0.1;
  } else if (pH.includes('>')) {
    // Handle greater than symbol
    pH = Number(pH.slice(1)) + 0.1;
  } else {
    pH = Number(pH);
  }

  if (isNaN(pH) || pH < 0 || pH > 14) {
    // Handle invalid pH values
    return null;
  } else if (pH <= 5.0) {
    return 'very acid';
  } else if (pH >= 5.1 && pH <= 6.5) {
    return 'acid';
  } else if (pH >= 6.6 && pH <= 7.3) {
    return 'neutral';
  } else if (pH >= 7.4 && pH <= 7.8) {
    return 'alkaline';
  } else if (pH >= 7.9) {
    return 'very alkaline';
  } else {
    return null;
  }
}

const unifyValueFormat = (plants, columnMapping) => {
  const mappedColumns = Object.keys(columnMapping).filter((key) => columnMapping[key] !== null);

  plants.forEach((plant) => {
    mappedColumns.forEach((column) => {
      if (plant[column]) {
        if (!!columnMapping[column]['valueMapping']) {
          plant[column] = plant[column]
            .split(',')
            .map((value) => {
              const updatedValue = value.trim().toLowerCase();
              if (
                columnMapping[column]['valueMapping'][updatedValue] ||
                columnMapping[column]['valueMapping'][updatedValue] === null
              ) {
                return columnMapping[column]['valueMapping'][updatedValue];
              }
              return value.trim();
            })
            .filter((value) => value !== null)
            .join(',');
        }

        if (column === 'soil_ph') {
          plant[column] = getSoilPH(plant[column]);
        }
      }

      if (columnMapping[column]['newName']) {
        plant[columnMapping[column]['newName']] = plant[column];
        if (columnMapping[column]['newName'] !== column) {
          delete plant[column];
        }
      }
    });
  });

  return plants;
};

const renameColumns = async (plants, columnMapping) => {
  const mappedColumns = Object.keys(columnMapping).filter(
    (key) => columnMapping[key] !== null && columnMapping[key]['map'] !== null,
  );

  plants.forEach((plant) => {
    mappedColumns.forEach((column) => {
      plant[column] = plant[columnMapping[column]['map']];
      delete plant[columnMapping[column]['map']];
    });
  });
  return plants;
};

const sanitizeValues = async (plants) => {
  const uniqueScientificNames = new Set();
  let sanitizedPlants = [];

  plants.forEach((plant) => {
    if (
      plant['scientific_name'] === 'Citrullus lanatus' &&
      plant['name'] === 'Blacktail' &&
      plant['slug'] === 'blacktail'
    ) {
      return;
    }

    const scientificName = plant['scientific_name'];
    if (uniqueScientificNames.has(scientificName)) {
      if (
        plant['type'] === 'Variety' ||
        (scientificName === 'Brassica oleracea acephala' && plant['name'] === 'Taunton Deane Kale')
      ) {
        plant['type'] = 'Variety';
        plant['scientific_name'] = plant['scientific_name'] + " '" + plant['name'] + "'";

        sanitizedPlants.push(plant);
      }
    } else {
      uniqueScientificNames.add(scientificName);
      sanitizedPlants.push(plant);
    }
  });

  return sanitizedPlants;
};

async function mergeDatasets() {
  console.log('[INFO] Merging datasets...');

  let allPlants = [];

  let practicalPlants = await csv().fromFile('data/detail.csv'); // Practical plants dataset
  let permapeople = await csv().fromFile('data/permapeopleRawData.csv'); // Permapeople dataset
  let reinsaat = await csv().fromFile('data/reinsaatRawData.csv'); // Reinsaat dataset

  sanitizeColumnNames(practicalPlants);
  sanitizeColumnNames(permapeople);
  sanitizeColumnNames(reinsaat);

  console.log('[INFO] practicalPlants: ', practicalPlants.length);
  console.log('[INFO] permapeople: ', permapeople.length);
  console.log('[INFO] reinsaat: ', reinsaat.length);

  practicalPlants = await renameColumns(practicalPlants, permapeopleColumnMapping);
  permapeople = await sanitizeValues(permapeople);

  practicalPlants.forEach((plant) => {
    const binomial_name = plant['binomial_name'];
    const plantInPermapeople = permapeople.find((plant) => plant.scientific_name === binomial_name);
    if (plantInPermapeople) {
      const mergedPlant = {};
      Object.keys(plantInPermapeople).forEach((key) => {
        if (
          key in mappedColumns &&
          mappedColumns[key]['priority'] === 'permapeople' &&
          !!plantInPermapeople[key]
        ) {
          mergedPlant[key] = plantInPermapeople[key];
        } else if (
          key in mappedColumns &&
          mappedColumns[key]['priority'] === 'practicalplants' &&
          !!plant[key]
        ) {
          mergedPlant[key] = plant[key];
        } else {
          mergedPlant[key] = plantInPermapeople[key] || plant[key];
        }
      });
      allPlants.push(mergedPlant);
    } else {
      allPlants.push({
        ...plant,
      });
    }
  });

  permapeople.forEach((plant) => {
    const scientific_name = plant['scientific_name'];
    const plantInPracticalPlants = practicalPlants.find(
      (plant) => plant.scientific_name === scientific_name,
    );
    if (!plantInPracticalPlants) {
      allPlants.push({
        ...plant,
      });
    }
  });

  console.log('[INFO] Merged practicalPlants and permapeople: ', allPlants.length);

  reinsaat.forEach((plant) => {
    const scientific_name = plant['scientific_name'];
    const plantInMerged = allPlants.find((plant) => plant['scientific_name'] === scientific_name);
    if (!plantInMerged) {
      console.log('[INFO] Plant not found in merged dataset: ', scientific_name);
      allPlants.push({
        ...plant,
      });
    } else {
      Object.keys(plant).forEach((key) => {
        if (plant[key] && !plantInMerged[key]) {
          plantInMerged[key] = plant[key];
        }
      });
    }
  });

  return allPlants;
}

function writePlantsToCsv(plants) {
  if (!fs.existsSync('data')) {
    fs.mkdirSync('data');
  }

  const updatedPlants = unifyValueFormat(plants, permapeopleColumnMapping);

  console.log('[INFO] Writing merged dataset to CSV file...');
  console.log('[INFO] Total number of plants: ', updatedPlants.length);

  const csv = json2csv(updatedPlants);
  fs.writeFileSync('data/mergedDatasets.csv', csv);

  return updatedPlants;
}

mergeDatasets()
  .then((plants) => writePlantsToCsv(plants))
  .catch((error) => console.error(error));
