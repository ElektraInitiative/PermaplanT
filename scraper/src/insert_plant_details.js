import pgPromise from 'pg-promise';
import csv from 'csvtojson';
import columnNames from './column_names.js';

import { config } from 'dotenv';
config();
const pgp = pgPromise({});

const db = pgp(process.env.DATABASE_URL);

function sanitizeColumnNames(jsonArray) {
    jsonArray.forEach((obj) => {
        Object.keys(obj).forEach((key) => {
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
            obj[newKey] = obj[key];
            delete obj[key];
            if (obj[newKey] === '') {
                obj[newKey] = null;
            } else if (obj[newKey] === '?') {
                obj[newKey] = null;
            }
            if (
                (newKey === 'soil_ph' && obj[newKey] !== null) ||
                (newKey === 'soil_texture' && obj[newKey] !== null) ||
                (newKey === 'soil_water_retention' && obj[newKey] !== null) ||
                (newKey === 'fertility' && obj[newKey] !== null) ||
                (newKey === 'life_cycle' && obj[newKey] !== null)
            ) {
                obj[newKey] = obj[newKey].split(',');
                obj[newKey] = obj[newKey].map((item) => {
                    return item.trim();
                });
            } else if (typeof obj[newKey] === 'string' && obj[newKey] !== null) {
                obj[newKey] = obj[newKey].trim();
            }
        });
    });
}

async function insertPlantDetails() {
    const jsonArray = await csv().fromFile('data/detail.csv');

    sanitizeColumnNames(jsonArray);

    const cs = new pgp.helpers.ColumnSet(columnNames, {
        table: 'plant_detail',
    });

    const query = pgp.helpers.insert(jsonArray, cs) + ' ON CONFLICT DO NOTHING';

    db.none(query);
}

insertPlantDetails();
