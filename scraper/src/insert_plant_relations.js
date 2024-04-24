import pgPromise from "pg-promise";

import { config } from "dotenv";
import { readCsv } from "./helpers/helpers.js";

config({
  path: ".env.local",
});

const pgp = pgPromise({});

const db = pgp(process.env.DATABASE_URL);
const companionsFilePath = process.argv[2] || "data/Companions.csv";
const antagonistFilePath = process.argv[3] || "data/Antagonist.csv";

/**
 * Get Ids via the unique plant names in the database and populate a map
 *
 * @param {*} map - a map with all unique plantnames
 *
 */
async function getIdsFromPlantnames(map) {
  const query = "SELECT id FROM plants WHERE unique_name = $1";
  for (let key of map.keys()) {
    let result = await db.oneOrNone(query, [key]);
    if (result !== null) {
      map.set(key, result.id);
    }
  }
}

/**
 * Insert Plant Relations into database.
 *
 * @param {*} jsonArray - an json array with all the csv informations
 * @param {*} map - a map with all unique plantnames and empty values
 * @param {*} relation - the relation we are adding atm. can be companion, neutral or antagonist. Its a ENUM in our database
 *
 */
async function insertPlantRelations(jsonArray, map, relation) {
  const cs = new pgp.helpers.ColumnSet(
    ["plant1", "plant2", "relation", "note"],
    { table: "relations" }
  );
  const uniquePairs = new Map();

  const data = jsonArray
    .filter((item) => {
      let plant1Id = map.get(item["Plant 1 (unique name)"]);
      let plant2Id = map.get(item["Plant 2 (unique name)"]);
      let key = plant1Id + "-" + plant2Id;
      if (uniquePairs.has(key)) {
        return false;
      }
      if (plant1Id === "" || plant2Id === "") {
        console.log(
          `Excluding ${relation} relation for ${item["Plant 1 (unique name)"]} <-> ${item["Plant 2 (unique name)"]}`
        );
        return false;
      }
      uniquePairs.set(key, true);
      return true;
    })
    .map((item) => {
      return {
        plant1: map.get(item["Plant 1 (unique name)"]),
        plant2: map.get(item["Plant 2 (unique name)"]),
        relation: relation,
        note: "Imported via scrapper",
      };
    });

  const companionQuery =
    pgp.helpers.insert(data, cs) +
    `ON CONFLICT ON CONSTRAINT relations_pkey DO UPDATE SET relation = '${relation}'`;

  console.log(`[INFO] Inserting ${relation} relations into database.`);

  await db
    .none(companionQuery)
    .then(() => {
      console.log(`[INFO] ${relation} relations inserted into database.`);
    })
    .catch((error) => {
      console.log("[ERROR]:", error);
    });
}

/**
 * Inserts the plants into the database
 *
 * @param {*} companionsFilePath - The file name of the companions csv file
 * @param {*} antagonistFilePath - The file name of the antagonist csv file
 */
async function start(companionsFilePath, antagonistFilePath) {
  console.log(
    "[INFO] Starting the insertion of plant relations into database."
  );

  const companionsJsonArray = await readCsv(companionsFilePath);
  const antagonistJsonArray = await readCsv(antagonistFilePath);
  const uniquePlantNameIdMap = new Map();

  //fill map with plantnames from the csv
  for (let row of companionsJsonArray) {
    uniquePlantNameIdMap.set(row["Plant 1 (unique name)"], "");
    uniquePlantNameIdMap.set(row["Plant 2 (unique name)"], "");
  }

  for (let row of antagonistJsonArray) {
    uniquePlantNameIdMap.set(row["Plant 1 (unique name)"], "");
    uniquePlantNameIdMap.set(row["Plant 2 (unique name)"], "");
  }

  await getIdsFromPlantnames(uniquePlantNameIdMap);

  await insertPlantRelations(
    companionsJsonArray,
    uniquePlantNameIdMap,
    "companion"
  );
  await insertPlantRelations(
    antagonistJsonArray,
    uniquePlantNameIdMap,
    "antagonist"
  );
}

start(companionsFilePath, antagonistFilePath);
