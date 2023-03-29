const { Pool } = require('pg');

const fs = require('fs');
const csv = require('csv-parser');

// Create a PostgreSQL pool
const pool = new Pool({
    user: 'permaplant',
    host: '127.0.0.1',
    database: 'permaplant',
    password: 'permaplant',
    port: 5432,
});

console.log('[INFO] Connected to PostgreSQL database');

const insertMap = async () => {
    // Delete the existing data
    try {
        console.log('[INFO] Deleting existing data from maps table');
        await pool.query('DELETE FROM map');
    } catch (error) {}

    console.log('[INFO] Inserting data into maps table');

    // Read the CSV file and insert the data into the database
    fs.createReadStream('map.csv')
        .pipe(csv())
        .on('data', async (row) => {
            const query = {
                text: 'INSERT INTO map(detail) VALUES($1)',
                values: [row.detail],
            };
            try {
                await pool.query(query);
            } catch (err) {
                console.error(err);
            }
        })
        .on('end', () => {
            console.log('[INFO] Finished inserting data into maps table');
            pool.end(); // close the pool
        });
};

insertMap();
