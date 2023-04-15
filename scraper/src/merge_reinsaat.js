import fs from 'fs';
import { parse as json2csv } from 'json2csv';
import csv from 'csvtojson';
import mapping from './helpers/column_mapping_reinsaat.js';

const renameColumns = (plants) => {
  return plants.map((plant) => {
    const renamedPlant = {};
    Object.keys(plant).forEach((key) => {
      if (mapping[key] === undefined) {
        delete plant[key];
        return;
      }
      const newKey = mapping[key];
      renamedPlant[newKey] = plant[key];
      if (newKey !== key) {
        delete plant[key];
      }
    });
    return renamedPlant;
  });
};

const sanitizeValues = (plants) => {
  return plants.map((plant) => {
    Object.keys(plant).forEach((key) => {
      if (key === 'scientific_name') {
        plant[key] = plant[key].replace(/convar\.\s?\w+\s/g, '').replace(/ssp\.\s?\w+\s/g, '');
        plant[key] = plant[key]
          .replaceAll('L.', '')
          .replaceAll('MIll.', '')
          .replaceAll('var.', '')
          .replaceAll('  ', ' ');
      }
      if (plant[key]) {
        plant[key] = plant[key].trim();
      }
    });
    return plant;
  });
};

const mergeColumns = (plant, oldCols, newCol) => {
  let mergedValue = '';
  for (let i = 0; i < oldCols.length; i++) {
    if (plant[oldCols[i]] !== '') {
      mergedValue = plant[oldCols[i]];
      break;
    }
  }

  if (mergedValue !== '') {
    plant[newCol] = mergedValue;
  }

  oldCols.forEach((oldCol) => {
    if (oldCol !== newCol) {
      delete plant[oldCol];
    }
  });
};

const renameCategory = (plants, lang) => {
  return plants.map((plant) => {
    if (plant['subcategory'] === undefined) {
      return plant;
    }
    plant['subcategory ' + lang] = plant['subcategory'];
    delete plant['subcategory'];
    return plant;
  });
};

async function mergeDatasets() {
  let allPlants = [];

  let reinsaatRawDataEN = await csv().fromFile('data/reinsaatRawDataEN.csv');
  let reinsaatRawDataDE = await csv().fromFile('data/reinsaatRawDataDE.csv');

  reinsaatRawDataEN = renameCategory(reinsaatRawDataEN, 'EN');
  reinsaatRawDataDE = renameCategory(reinsaatRawDataDE, 'DE');

  reinsaatRawDataEN.forEach((plant) => {
    const plantDE = reinsaatRawDataDE.find(
      (p) => p['Scientific name'] === plant['Scientific name'],
    );
    if (plantDE) {
      allPlants.push({ ...plant, ...plantDE });
    } else {
      allPlants.push(plant);
    }
  });

  reinsaatRawDataDE.forEach((plant) => {
    const plantEN = reinsaatRawDataEN.find(
      (p) => p['Scientific name'] === plant['Scientific name'],
    );
    if (!plantEN) {
      allPlants.push(plant);
    }
  });

  allPlants.forEach((plant) => {
    mergeColumns(plant, ['Aussaat', 'Direktsaat'], 'Direktsaat');
    mergeColumns(
      plant,
      ['Sowing', 'Direct Sowing', 'Sowing outdoors', 'Sowing Direct Outdoors'],
      'Sowing',
    );
    mergeColumns(plant, ['Distances', 'Spacing'], 'Distances');
  });

  allPlants = renameColumns(allPlants);

  allPlants = sanitizeValues(allPlants);

  return allPlants;
}

function writePlantsToCsv(plants) {
  if (!fs.existsSync('data')) {
    fs.mkdirSync('data');
  }

  const csv = json2csv(plants);
  fs.writeFileSync('data/reinsaatRawData.csv', csv);

  return plants;
}

mergeDatasets()
  .then((plants) => writePlantsToCsv(plants))
  .catch((error) => console.error(error));
