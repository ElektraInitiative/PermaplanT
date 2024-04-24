import fs from "fs";
import path from "path";
import { parse as json2csv } from "json2csv";
import { cleanUpJsonForCsv, readCsv } from "./helpers/helpers.js";
import { applyOverride } from "./helpers/override.js";

const deletionsFile = "00_DELETIONS.csv";

async function loadMergedDataset() {
  return readCsv("data/mergedDatasets.csv");
}

async function applyDeletions(plants) {
  console.log(`[INFO] Deleting plants from data/overrides/${deletionsFile}`);

  const deletePlants = await readCsv(`data/overrides/${deletionsFile}`);

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

async function applyAllOverrides(plants) {
  let overridesDir = "data/overrides";
  if (!fs.existsSync(overridesDir)) {
    fs.mkdirSync(overridesDir);
  }

  // list all csv files in data/overrides
  const overrideFiles = fs.readdirSync(overridesDir);
  overrideFiles.sort();

  // apply all overrides
  for (const file of overrideFiles) {
    // deletions were handled separately
    if (path.extname(file) !== ".csv" || file === deletionsFile) {
      continue;
    }
    await applyOverride(plants, `${overridesDir}/${file}`);
  }

  return plants;
}

async function writePlantsToOverwriteCsv(plants) {
  console.log(
    `[INFO] Writing ${plants.length} plants to csv data/finalDataset.csv`
  );
  cleanUpJsonForCsv(plants);
  const csvFile = json2csv(plants);
  fs.writeFileSync("data/finalDataset.csv", csvFile);

  return plants;
}

loadMergedDataset()
  .then((plants) => applyDeletions(plants))
  .then((plants) => applyAllOverrides(plants))
  .then((plants) => writePlantsToOverwriteCsv(plants))
  .catch((error) => console.error(error));
