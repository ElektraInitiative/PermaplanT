import fs from 'fs';
import { parse as json2csv } from 'json2csv';
import csv from 'csvtojson';
import columnMapping from './column_mapping_permapeople.js';

function sanitizeColumnNames(jsonArray) {
  const sanitizeKey = (key) => {
    let newKey = key
      .toLowerCase()
      .replaceAll('&amp;', 'and')
      .replaceAll('&', 'and')
      .replaceAll(' ', '_')
      .replaceAll('(', '')
      .replaceAll(')', '')
      .replaceAll('-', '_')
      .replaceAll('___', '_');
    return newKey;
  };

  jsonArray.forEach((obj) => {
    const keys = Object.keys(obj);
    keys.forEach((key) => {
      const newKey = sanitizeKey(key);
      if (newKey !== key) {
        obj[newKey] = obj[key];
        delete obj[key];
      }
    });
  });

  return jsonArray;
}

async function compareDatabases() {
  const allPlants = [];

  const practicalPlants = await csv().fromFile('data/detail.csv');
  const permapeople = await csv().fromFile('data/permapeopleRawData.csv');

  sanitizeColumnNames(practicalPlants);
  sanitizeColumnNames(permapeople);

  practicalPlants.forEach((plant) => {
    const binomial_name = plant['binomial_name'];
    const plantInPermapeople = permapeople.find((plant) => plant.scientific_name === binomial_name);
    if (plantInPermapeople) {
      allPlants.push({
        ...plantInPermapeople,
        ...plant,
        contained_in: 'both',
      });
    } else {
      allPlants.push({
        ...plant,
        contained_in: 'practicalPlants',
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
        contained_in: 'permapeople',
      });
    }
  });

  return allPlants;
}

function writePlantsToCsv(plants) {
  plants.sort((a, b) => a['contained_in'].localeCompare(b['contained_in']));

  const permapeopleKeys = Object.keys(columnMapping).filter((key) => key !== 'scientific_name');

  const mappedKeys = permapeopleKeys
    .filter((key) => columnMapping[key] !== null)
    .map((permapeopleKey) => {
      const practicalPlantsKey = columnMapping[permapeopleKey];
      return [permapeopleKey, practicalPlantsKey];
    })
    .flat();

  const unmappedKeys = permapeopleKeys.filter((key) => key !== null && !mappedKeys.includes(key));

  const fields = [
    'contained_in',
    'binomial_name',
    'scientific_name',
    ...mappedKeys,
    ...unmappedKeys,
    ...Object.keys(plants[0]).filter((key) => {
      const isMappedColumn = Object.values(mappedKeys).includes(key);
      return !['contained_in', 'binomial_name', 'scientific_name'].includes(key) && !isMappedColumn;
    }),
  ];

  if (!fs.existsSync('data')) {
    fs.mkdirSync('data');
  }
  const csv = json2csv(plants, { fields });
  fs.writeFileSync('data/permapeopleDifferences.csv', csv);
  return plants;
}

compareDatabases()
  .then((plants) => writePlantsToCsv(plants))
  .catch((error) => console.error(error));
