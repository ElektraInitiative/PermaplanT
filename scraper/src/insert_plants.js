import pgPromise from 'pg-promise';
import csv from 'csvtojson';
import dbPlantsColumns from './helpers/dp_plants_columns.js';
import { sanitizeColumnNames } from './helpers/helpers.js';

import { config } from 'dotenv';
config();
const pgp = pgPromise({});

const db = pgp(process.env.DATABASE_URL);
const plantsFilePath = process.argv[2] || 'data/mergedDatasets.csv';

/**
 * Sanitizes the values of the json array
 *
 * @param {*} jsonArray - The json array to be sanitized
 * @returns - The sanitized json array
 */
function sanitizeValues(jsonArray) {
  return jsonArray.map((obj) => {
    const keys = Object.keys(obj);
    Object.assign(obj, {});
    keys.forEach((newKey) => {
      obj[newKey] = obj[newKey].trim();
      if (obj[newKey] === '') {
        obj[newKey] = null;
      }

      if (
        (newKey === 'soil_ph' && obj[newKey] !== null) ||
        (newKey === 'soil_texture' && obj[newKey] !== null) ||
        (newKey === 'soil_water_retention' && obj[newKey] !== null) ||
        (newKey === 'fertility' && obj[newKey] !== null) ||
        (newKey === 'life_cycle' && obj[newKey] !== null) ||
        (newKey === 'common_name' && obj[newKey] !== null) ||
        (newKey === 'common_name_de' && obj[newKey] !== null)
      ) {
        obj[newKey] = obj[newKey].split(',');
        obj[newKey] = obj[newKey].map((item) => {
          return item.trim();
        });
      }

      if (newKey === 'plant_references' && obj[newKey] !== null) {
        obj[newKey] = obj[newKey].split('///ref///');
        obj[newKey] = obj[newKey].map((item) => {
          return item.trim();
        });
      }

      if (newKey === 'environmental_tolerances' && obj[newKey] !== null) {
        obj[newKey] = obj[newKey].split('\n');
        obj[newKey] = obj[newKey].map((item) => {
          return item.trim();
        });
      }
    });

    return obj;
  });
}

/**
 * Inserts the plants into the database
 *
 * @param {*} fileName - The file name of the csv file
 */
async function insertPlants(fileName) {
  console.log('[INFO] Starting the insertion of plants into database.');

  const jsonArray = await csv().fromFile(fileName);

  sanitizeColumnNames(jsonArray);

  sanitizeValues(jsonArray);

  const cs = new pgp.helpers.ColumnSet(dbPlantsColumns, {
    table: 'plants',
  });

  const query =
    pgp.helpers.insert(jsonArray, cs) +
    ` ON CONFLICT ON CONSTRAINT plant_detail_binomial_name_key DO UPDATE SET ${cs.assignColumns({
      from: 'EXCLUDED',
      skip: 'binomial_name',
    })}, updated_at = NOW()`;

  console.log('[INFO] Inserting plant details into database.');

  db.none(query);

  console.log('[INFO] Plant details inserted into database.');
}

insertPlants(plantsFilePath);
