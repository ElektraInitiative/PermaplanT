import pgPromise from 'pg-promise';
import csv from 'csvtojson';

import { config } from 'dotenv';
config();
const pgp = pgPromise({});

const db = pgp(process.env.DATABASE_URL);
const companionsFilePath = process.argv[2] || 'data/Companions.csv';
const antagonistFilePath = process.argv[3] || 'data/Companions.csv';

/**
 * Get Ids via the unique plant names in the database and populate a map 
 *
 * @param {*} map - a map with all unique plantnames and empty values
 */
function getIdsFromPlantnames(map){
  const query = 'SELECT id FROM plant_detail WHERE unique_name = $1';
  for(let key of map.keys()) {
    db.any(query, [key])
        .then((result) => {
            console.log(result);
            map.set(key, result)
        })
        .catch((error) => {
            console.log("ERROR:", error);
            //what should i do with plants not existing in our db? 
        });
  }

}

/**
 * Inserts the plants into the database
 *
 * @param {*} fileName - The file name of the csv file
 */
async function insertPlantRelations(companionsFilePath, antagonistFilePath) {
  // Define the table and columns
  const cs = new pgp.helpers.ColumnSet(['plant1', 'plant2', 'relation', 'note'], {table: 'relations'});
  console.log('[INFO] Starting the insertion of plants into database.');

  const companionsJsonArray = await csv().fromFile(companionsFilePath);
  const antagonistJsonArray = await csv().fromFile(antagonistFilePath);
  const uniquePlantNameIdMap = new Map();

  //fill map with plantnames from the csv
  for(let row of companionsJsonArray) {
    uniquePlantNameIdMap.set(row["Plant 1 (unique name)"], "");
    uniquePlantNameIdMap.set(row["Plant 2 (unique name)"], "");
  }

  for(let row of antagonistJsonArray) {
    uniquePlantNameIdMap.set(row["Plant 1 (unique name)"], "");
    uniquePlantNameIdMap.set(row["Plant 2 (unique name)"], "");
  }


  getIdsFromPlantnames(uniquePlantNameIdMap);
  //catch error, if names dont exist, log them, keep them out of batch 
  const companionsData = companionsJsonArray.map(item => [
    item["Plant 1 (unique name)"],
    item["Plant 2 (unique name)"],
    "companion",
    "Imported via scrapper"
  ]);

  // Create a multi-row insert query
  const query = pgp.helpers.insert(companionsData, cs);

  console.log('[INFO] Inserting companion relations into database.');

  db.none(query)
  .then(() => {
      console.log("[INFO] Companion relations inserted into database.");
  })
  .catch(error => {
      console.log("[ERROR]:", error);
  });


  //console.log('[INFO] Companion relations inserted into database.');
}

insertPlantRelations(companionsFilePath, antagonistFilePath);

