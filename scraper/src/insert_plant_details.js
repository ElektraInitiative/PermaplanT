const pgp = require('pg-promise')();
const csv = require('csvtojson');

require('dotenv').config();

const db = pgp({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT,
});

function sanitizeColumnNames(jsonArray) {
    jsonArray.forEach((obj) => {
        Object.keys(obj).forEach((key) => {
            let newKey = key;
            newKey = newKey.toLowerCase();
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
            }
        });
    });
}

async function insertPlantDetails() {
    const jsonArray = await csv().fromFile('data/detail.csv');

    sanitizeColumnNames(jsonArray);

    const cs = new pgp.helpers.ColumnSet(Object.keys(jsonArray[0]), {
        table: 'plant_detail',
    });

    const query = pgp.helpers.insert(jsonArray, cs) + ' ON CONFLICT DO NOTHING';

    db.none(query);
}

insertPlantDetails();
