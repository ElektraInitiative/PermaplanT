import fs from 'fs';
import { parse as json2csv } from 'json2csv';
import csv from 'csvtojson';
import permapeopleColumnMapping from './column_mapping_permapeople.js';
import { sanitizeColumnNames } from './helpers/helpers.js';

const finalColumnMapping = {
  common_name: 'common_name_en',
  binomial_name: 'scientific_name',
};

const renameColumns = async (plants, columnMapping) => {
  const mappedColumns = Object.keys(columnMapping).filter((key) => columnMapping[key] !== null);

  plants.forEach((plant) => {
    mappedColumns.forEach((column) => {
      const newColumnName = columnMapping[column];
      plant[newColumnName] = plant[column];
      delete plant[column];
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

  permapeople = await renameColumns(permapeople, permapeopleColumnMapping);

  practicalPlants.forEach((plant) => {
    const binomial_name = plant['binomial_name'];
    const plantInPermapeople = permapeople.find((plant) => plant.scientific_name === binomial_name);
    if (plantInPermapeople) {
      allPlants.push({
        ...plantInPermapeople,
        ...plant,
      });
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

  allPlants = renameColumns(allPlants, finalColumnMapping);

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
