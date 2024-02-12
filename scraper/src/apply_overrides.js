import fs from "fs";
import path from "path";
import { parse as json2csv } from "json2csv";
import csv from "csvtojson";

const deletionsFile = "00_DELETIONS.csv";

async function loadMergedDataset() {
  return csv().fromFile("data/mergedDatasets.csv");
}

async function applyDeletions(plants) {
  console.log(`Deleting plants from data/overrides/${deletionsFile}`);

  const deletePlants = await csv().fromFile(`data/overrides/${deletionsFile}`);

  deletePlants.forEach((overridePlant) => {
    // find the plant
    const index = plants.findIndex(
      (plant) => plant.unique_name === overridePlant.unique_name
    );

    if (index === -1) {
      console.log(
        `[INFO] Could not find plant with unique_name '${overridePlant.unique_name}' in merged dataset.`
      );
      return;
    }

    // delete the plant
    plants.splice(index, 1);
  });

  return plants;
}

async function applyOverrides(plants) {
  if (!fs.existsSync("data/overrides")) {
    fs.mkdirSync("data/overrides");
  }

  // list all csv files in data/overrides
  const overrideFiles = fs.readdirSync("data/overrides");

  // apply all overrides, deletions are handled separately
  for (const file of overrideFiles) {
    if (path.extname(file) !== ".csv" || file === deletionsFile) {
      continue;
    }
    console.log(`Applying data/overrides/${file}`);

    const overridePlants = await csv().fromFile(`data/overrides/${file}`);

    overridePlants.forEach((overridePlant) => {
      // find the plant
      const index = plants.findIndex(
        (plant) => plant.unique_name === overridePlant.unique_name
      );

      if (index === -1) {
        console.log(
          `[INFO] Could not find plant with unique_name '${overridePlant.unique_name}' in merged dataset.`
        );
        return;
      }

      // for each column in the override plant, update the plant
      Object.keys(overridePlant).forEach((key) => {
        if (key !== "unique_name") {
          if (key === "new_unique_name") {
            // actually override the unique name
            key = "unique_name";
          }

          plants[index][key] = overridePlant[key].trim();
        }
      });
    });
  }

  return plants;
}

function cleanUpJsonForCsv(plants) {
  const columns = Object.keys(plants[0]);
  plants.forEach((plant, index) => {
    columns.forEach((column) => {
      if (plant[column] === "") {
        plant[column] = null;
      }
    });
  });
  return plants;
}

async function writePlantsToOverwriteCsv(plants) {
  console.log("[INFO] Total number of plants: ", plants.length);

  console.log("[INFO] Writing plants to csv data/final_plants.csv");
  const csvFile = json2csv(cleanUpJsonForCsv(plants));
  fs.writeFileSync("data/final_plants.csv", csvFile);

  return plants;
}

loadMergedDataset()
  .then((plants) => applyDeletions(plants))
  .then((plants) => applyOverrides(plants))
  .then((plants) => writePlantsToOverwriteCsv(plants))
  .catch((error) => console.error(error));
