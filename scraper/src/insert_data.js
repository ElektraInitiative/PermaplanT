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

async function insertData() {
    const jsonArray = await csv().fromFile('data/plants.csv');
    const cs = new pgp.helpers.ColumnSet(['url', 'name'], { table: 'plants' });

    const query = pgp.helpers.insert(jsonArray, cs) + ' ON CONFLICT DO NOTHING';

    db.none(query);
}

insertData();
