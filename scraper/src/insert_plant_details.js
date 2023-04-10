import pgPromise from "pg-promise";
import csv from "csvtojson";
import columnNames from "./column_names.js";

import { config } from "dotenv";
config();
const pgp = pgPromise({});

const db = pgp(process.env.DATABASE_URL);

if (process.argv.length == 2) {
    insertGenus("data/distinctGenus.csv");
    insertFamily("data/distinctFamily.csv");
    insertPlantDetails("data/detail.csv");
} else if (process.argv.length === 3) {
    insertPlantDetails(process.argv[2]);
} else if (process.argv.length === 4) {
    const fileName = process.argv[2];
    if (process.argv[3] === "genus") {
        insertGenus(fileName);
    } else if (process.argv[3] === "family") {
        insertFamily(fileName);
    } else {
        console.log("USAGE: npm run insert <generated-file> [genus|family]");
        process.exit(1);
    }
}

function sanitizeColumnNames(jsonArray) {
  return jsonArray.map((obj) => {
    const keys = Object.keys(obj);
    keys.forEach((key) => {
      let newKey = key;
      newKey = newKey.toLowerCase();
      if (newKey.includes("&amp;")) {
        newKey = newKey.split("&amp;").join("and");
      }
      if (newKey.includes("&")) {
        newKey = newKey.split("&").join("and");
      }
      if (newKey.includes(" ")) {
        newKey = newKey.split(" ").join("_");
      }
      obj[newKey] = obj[key];
      delete obj[key];
    });
  });
}

function sanitizeValues(jsonArray) {
  return jsonArray.map((obj) => {
    const keys = Object.keys(obj);
    Object.assign(obj, {});
    keys.forEach((newKey) => {
      obj[newKey] = obj[newKey].trim();
      if (obj[newKey] === "") {
        obj[newKey] = null;
      }

      if (
        (newKey === "soil_ph" && obj[newKey] !== null) ||
        (newKey === "soil_texture" && obj[newKey] !== null) ||
        (newKey === "soil_water_retention" && obj[newKey] !== null) ||
        (newKey === "fertility" && obj[newKey] !== null) ||
        (newKey === "life_cycle" && obj[newKey] !== null) ||
        (newKey === "common_name" && obj[newKey] !== null) ||
        (newKey === "common_name_de" && obj[newKey] !== null)
      ) {
        obj[newKey] = obj[newKey].split(",");
        obj[newKey] = obj[newKey].map((item) => {
          return item.trim();
        });
      }

      if (newKey === "plant_references" && obj[newKey] !== null) {
        obj[newKey] = obj[newKey].split("///ref///");
        obj[newKey] = obj[newKey].map((item) => {
          return item.trim();
        });
      }

      if (newKey === "environmental_tolerances" && obj[newKey] !== null) {
        obj[newKey] = obj[newKey].split("\n");
        obj[newKey] = obj[newKey].map((item) => {
          return item.trim();
        });
      }
    });

    return obj;
  });
}

async function insertPlantDetails(fileName) {
  const jsonArray = await csv().fromFile(fileName);

  sanitizeColumnNames(jsonArray);

  sanitizeValues(jsonArray);

  const cs = new pgp.helpers.ColumnSet(columnNames, {
    table: "plants",
  });

  const query =
    pgp.helpers.insert(jsonArray, cs) +
    ` ON CONFLICT ON CONSTRAINT plant_detail_binomial_name_key DO UPDATE SET ${cs.assignColumns(
      {
        from: "EXCLUDED",
        skip: "binomial_name",
      }
    )}, updated_at = NOW()`;

  db.none(query);
}

async function insertGenus(fileName) {
    let jsonArray = await csv().fromFile(fileName);

    sanitizeColumnNames(jsonArray);

    jsonArray = jsonArray.map((obj) => {
        return { name: obj['genus'].trim() };
    });
    const cs = new pgp.helpers.ColumnSet(['name'], {
        table: 'genus',
    });

    const query = pgp.helpers.insert(jsonArray, cs) + ' ON CONFLICT DO NOTHING';

    db.none(query);
}

async function insertFamily(fileName) {
    let jsonArray = await csv().fromFile(fileName);

    sanitizeColumnNames(jsonArray);

    jsonArray = jsonArray.map((obj) => {
        return { name: obj['family'].trim() };
    });
    const cs = new pgp.helpers.ColumnSet(['name'], {
        table: 'family',
    });

    const query = pgp.helpers.insert(jsonArray, cs) + ' ON CONFLICT DO NOTHING';

    db.none(query);
}
