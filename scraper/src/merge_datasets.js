import fs from 'fs';
import { parse as json2csv } from 'json2csv';
import csv from 'csvtojson';
import permapeopleColumnMapping from './helpers/column_mapping_permapeople.js';
import { sanitizeColumnNames } from './helpers/helpers.js';

const finalColumnMapping = {
  common_name: 'common_name_en',
};

const renameColumns = async (plants, columnMapping) => {
  const mappedColumns = Object.keys(columnMapping).filter((key) => columnMapping[key] !== null);

  plants.forEach((plant) => {
    mappedColumns.forEach((column) => {
      plant[column] = plant[columnMapping[column]['map']];
      delete plant[columnMapping[column]['map']];
    });
  });
  return plants;
};

async function mergeDatasets() {
  let allPlants = [];

  let practicalPlants = await csv().fromFile('data/detail.csv'); // Practical plants dataset
  let permapeople = await csv().fromFile('data/permapeopleRawData.csv'); // Permapeople dataset

  practicalPlants = practicalPlants.slice(0, 1);
  permapeople = permapeople.slice(0, 1);

  sanitizeColumnNames(practicalPlants);
  sanitizeColumnNames(permapeople);

  practicalPlants = await renameColumns(practicalPlants, permapeopleColumnMapping);

  console.log(Object.keys(permapeople[0]));

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
      (plant) => plant.binomial_name === scientific_name,
    );
    if (!plantInPracticalPlants) {
      allPlants.push({
        ...plant,
      });
    }
  });

  // allPlants = renameColumns(allPlants, finalColumnMapping);

  return allPlants;
}

function writePlantsToCsv(plants) {
  if (!fs.existsSync('data')) {
    fs.mkdirSync('data');
  }
  const csv = json2csv(plants);
  fs.writeFileSync('data/mergedDatasets.csv', csv);
  return plants;
}

mergeDatasets()
  .then((plants) => writePlantsToCsv(plants))
  .catch((error) => console.error(error));
