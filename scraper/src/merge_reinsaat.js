import fs from 'fs';
import { parse as json2csv } from 'json2csv';
import csv from 'csvtojson';
import { sanitizeColumnNames } from './helpers/helpers.js';

const mapping = {
  Artikelnummer: 'reinsaat_article_number',
  Portionsinhalt: 'reinsaat_portion_content',
  Direktsaat: 'sowing_outdoors_de',
  url: 'reinsaat_url',
  'Aussaat/ Pflanzung Freiland': 'sowing_outdoors',
  Ernte: 'harvest_time',
  Abstände: 'spacing_de',
  Aussaat: 'sowing_de',
  Saatgutbedarf: 'required_quantity_of_seeds_de',
  'Required quantity of seeds': 'required_quantity_of_seeds_en',
  Saattiefe: 'seed_planting_depth_de',
  Tausendkornmasse: '1000_seed_weight_de',
  'Thousand seeds mass': '1000_seed_weight_en',
  'Suitable for professional cultivation': 'machine_cultivation_possible',
  subcategory: 'edible_uses_de',
  'Tausendkorngewicht (TKG)': '1000_seed_weight',
  Sowing: 'sowing_en',
  Distances: 'spacing_en',
  'Sowing depth': 'seed_planting_depth_en',
  '1st harvest': 'days_to_harvest',
  Keimtemperatur: 'germination_temperature',
  'Unique name': 'unique_name',
};

const renameColumns = async (plants) => {
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
      if (key === 'unique_name') {
        plant[key] = plant[key].replace(/convar\.\s?\w+\s/g, '').replace(/ssp\.\s?\w+\s/g, '');
        plant[key] = plant[key]
          .replaceAll('L.', '')
          .replaceAll('MIll.', '')
          .replaceAll('var.', '')
          .replaceAll('  ', ' ');
      }
      plant[key] = plant[key].trim();
    });
    return plant;
  });
};

async function mergeDatasets() {
  let allPlants = [];

  let reinsaatRawDataEN = await csv().fromFile('data/reinsaatRawDataEN.csv');
  let reinsaatRawDataDE = await csv().fromFile('data/reinsaatRawDataDE.csv');

  reinsaatRawDataEN = reinsaatRawDataEN.slice(0, 1);
  reinsaatRawDataDE = reinsaatRawDataDE.slice(0, 1);

  allPlants = reinsaatRawDataEN.concat(reinsaatRawDataDE);

  allPlants = await renameColumns(allPlants);

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
