import pgPromise from 'pg-promise';
import csv from 'csvtojson';
import columnNames from './column_names.js';

import { config } from 'dotenv';
config();
const pgp = pgPromise({});

const db = pgp(process.env.DATABASE_URL);

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
            obj[newKey] = obj[key];
            delete obj[key];
        });
    });
}

function sanitizeValues(jsonArray) {
    return jsonArray.map((obj) => {
        const keys = Object.keys(obj);
        Object.assign(obj, {
            is_tree: null,
        });
        keys.forEach((newKey) => {
            obj[newKey] = obj[newKey].trim();
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
                (newKey === 'life_cycle' && obj[newKey] !== null) ||
                (newKey === 'common_name' && obj[newKey] !== null)
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

            if (obj[newKey] === 'None listed.') {
                obj[newKey] = null;
            }
        });

        if (
            obj['herbaceous_or_woody'] === 'woody' &&
            obj['life_cycle'] &&
            obj['life_cycle'].includes('perennial')
        ) {
            obj['is_tree'] = true;
        }

        return obj;
    });
}

async function insertPlantDetails() {
    const jsonArray = await csv().fromFile('data/detail.csv');

    sanitizeColumnNames(jsonArray);

    sanitizeValues(jsonArray);

    const cs = new pgp.helpers.ColumnSet(columnNames, {
        table: 'plant_detail',
    });

    const query = pgp.helpers.insert(jsonArray, cs) + ' ON CONFLICT DO NOTHING';

    db.none(query);
}

insertPlantDetails();
