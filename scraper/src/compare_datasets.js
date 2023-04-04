import fs from 'fs';
import { parse as json2csv } from 'json2csv';
import csv from 'csvtojson';

function sanitizeColumnNames(jsonArray) {
  return jsonArray.map((obj) => {
    const keys = Object.keys(obj);
    keys.forEach((key) => {
      let newKey = key;
      newKey = newKey.toLowerCase();
      if (newKey.includes('&amp;')) {
        newKey = newKey.split('&amp;').join('and');
      }
      if (newKey.includes('&')) {
        newKey = newKey.split('&').join('and');
      }
      if (newKey.includes(' ')) {
        newKey = newKey.split(' ').join('_');
      }
      if (newKey.includes('(')) {
        newKey = newKey.split('(').join('');
      }
      if (newKey.includes(')')) {
        newKey = newKey.split(')').join('');
      }
      if (newKey.includes('-')) {
        newKey = newKey.split('-').join('_');
      }
      if (newKey.includes('___')) {
        newKey = newKey.split('___').join('_');
      }
      obj[newKey] = obj[key];
      if (key !== newKey) {
        delete obj[key];
      }
    });
  });
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
        practicalPlantsValue: plant,
        permapeopleValue: null,
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
        practicalPlantsValue: null,
        permapeopleValue: plant,
      });
    }
  });

  return allPlants;
}

function writePlantsToCsv(plants) {
  const fields = [
    'contained_in',
    'binomial_name',
    'scientific_name',
    ...Object.keys(plants[0]).filter(
      (key) => key !== 'contained_in' && key !== 'binomial_name' && key !== 'scientific_name',
    ),
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

// const mappedValues = {};
// for (const permapeopleKey in columnMapping) {
//   const practicalPlantsKey = columnMapping[permapeopleKey];
//   if (
//     practicalPlantsKeys.includes(practicalPlantsKey) &&
//     Object.keys(plant).includes(practicalPlantsKey) &&
//     Object.keys(permapeoplePlant).includes(permapeopleKey)
//   ) {
//     mappedValues[permapeopleKey] = {
//       practicalPlantsValue: plant[practicalPlantsKey],
//       permapeopleValue: permapeoplePlant[permapeopleKey],
//     };
//   }
// }F
