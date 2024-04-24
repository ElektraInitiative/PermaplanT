import fs from "fs";
import { parse as json2csv } from "json2csv";
import { cleanUpJsonForCsv, readCsv } from "./helpers/helpers.js";
import { applyOverride } from "./helpers/override.js";

const germanCommonNames = "data/germanCommonNames.csv";

async function loadMergedDataset() {
  return readCsv("data/mergedDatasets.csv");
}

async function applyGermanNames(plants) {
  return applyOverride(plants, germanCommonNames);
}

async function writePlantsToOverwriteCsv(plants) {
  console.log(
    `[INFO] Writing ${plants.length} plants to csv data/mergedDatasets.csv`
  );
  cleanUpJsonForCsv(plants);
  const csvFile = json2csv(plants);
  fs.writeFileSync("data/mergedDatasets.csv", csvFile);

  return plants;
}

loadMergedDataset()
  .then((plants) => applyGermanNames(plants))
  .then((plants) => writePlantsToOverwriteCsv(plants))
  .catch((error) => console.error(error));
