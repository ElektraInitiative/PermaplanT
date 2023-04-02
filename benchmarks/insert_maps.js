const pgPromise = require('pg-promise');
const csv = require('csvtojson');

const pgp = pgPromise({});

const db = pgp('postgres://permaplant:permaplant@127.0.0.1/permaplant');

console.log('[INFO] Connected to PostgreSQL database');

const insertMap = async () => {
    // Delete the existing data
    try {
        console.log('[INFO] Deleting existing data from maps table');
        await pool.query('DELETE FROM map');
    } catch (error) {}

    console.log('[INFO] Inserting data into maps table');

    const jsonArray = await csv().fromFile('map.csv');

    const cs = new pgp.helpers.ColumnSet([{ name: 'id' }, { name: 'detail' }], {
        table: 'map',
    });

    const query = pgp.helpers.insert(jsonArray, cs) + ` ON CONFLICT DO NOTHING`;

    db.none(query);
};

insertMap();
