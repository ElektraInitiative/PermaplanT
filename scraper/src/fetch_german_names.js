import axios from "axios";
import axiosRetry from "axios-retry";
import fs from "fs";
import { parse as json2csv } from "json2csv";
import csv from "csvtojson";
import { capitalizeWords } from "./helpers/helpers.js";

let GermanNamesFound = 0;

/**
 * Defines the amount of retries we do, if axios encounters errors during a HTTP GET Request.
 * Increse Delay if we encounter error to prevent 429 Errors.
 */
axiosRetry(axios, {
  retries: 5, // number of retries
  retryDelay: (retryCount) => {
    console.log(`retry attempt: ${retryCount}`);
    return retryCount * 3000; // time interval between retries
  },
  retryCondition: (error) => {
    return error.response.status === 429;
  },
});

/**
 * Fetches the German name of the plant from the Wikidata API.
 * Sets the 'common_name_de' property of every plant in the array.
 *
 * @param {string[]} germanNames - An array with German plant names.
 * @param {string} unique_name - A plant name to filter if it's in the German names.
 */
const filterGermanNames = (germanNames, unique_name) => {
  let unique_name_filter = unique_name.toLowerCase();
  unique_name_filter = unique_name_filter.replace(/(?<!\S)[x×]/, " ");
  unique_name_filter = unique_name_filter.replace(/\s+/g, " ");
  const unique_names = unique_name_filter.split(" ");
  const cleanedGermanNames = [];

  for (const singleGermanName of germanNames) {
    let germanName = singleGermanName.toLowerCase();

    germanName = germanName.replace(/ \(.*\)/, "");
    //remove special characters
    germanName = germanName.replace(/['"`-]/, "");
    //remove hybrid x or × symbol
    germanName = germanName.replace(/(?<!\S)[x×]/, " ");
    unique_name_filter = unique_name_filter.replace(/\s+/g, " ");

    germanName = germanName.trim();
    if (
      unique_names.some((unique_name_part) =>
        germanName.includes(unique_name_part)
      )
    ) {
      continue;
    }

    if (germanName.length !== 0 && germanName !== "true") {
      cleanedGermanNames.push(capitalizeWords(germanName));
    }
  }
  //remove duplicates
  const uniqueNameSet = new Set(cleanedGermanNames);

  return Array.from(uniqueNameSet);
};

/**
 * Handles the response from Wikidata.
 * Gets the German label, dewiki, and alias entries and adds them to the found possible German names.
 *
 * @param {*} response - Response object from the axios function.
 * @param {Array} germanNames - An array containing the currently found German names.
 */
const handleResponseAddGermanNamesFound = (response, germanNames) => {
  const data = response.data;

  if (data.normalized) {
    //This isn't the correct plant, it got redirected to somewhere else.
    return;
  }

  const entities = data.entities;

  if (entities[-1]) {
    // If there is a -1, the site doesn't exist
    return;
  }

  const keys = Object.keys(entities);
  const entity = entities[keys[0]];

  const label_entity = entity.labels;
  if (label_entity && label_entity.de) {
    germanNames.push(label_entity.de.value);
  } else {
    //If there is no label for the plant, then there are no other relevant german common names.
    return;
  }

  const dewiki_entity = entity.sitelinks.dewiki;
  if (dewiki_entity) {
    germanNames.push(dewiki_entity.title);
  }

  const aliase_entities = entity.aliases.de;
  if (aliase_entities) {
    aliase_entities.forEach((alias) => {
      germanNames.push(alias.value);
    });
  }
};

/**
 * Fetches the German name of the plant from the Wikidata API.
 * Sets the 'common_name_de' property of every plant in the array.
 * Uses the current entry in 'common_name_de' and extends it with data found on Wikidata.
 *
 * @param {Array} plants - An array containing a part of all plant objects.
 */
const processPlants = async (plants) => {
  for (const plant of plants) {
    const unique_name = plant["unique_name"];
    const germanNames = [];

    if (plant.common_name_de && plant.common_name_de !== "true") {
      const existingGermanNames = plant.common_name_de.split(",");
      existingGermanNames.forEach((existingGermanName) => {
        germanNames.push(existingGermanName);
      });
    }

    plant.common_name_de = null;

    await axios
      .get(
        `https://www.wikidata.org/w/api.php?action=wbgetentities&sites=enwiki&titles=${unique_name}&normalize=&languages=de&format=json`
      )
      .then((response) => {
        // log response code
        handleResponseAddGermanNamesFound(response, germanNames);
      })
      .catch((error) => {
        console.error(
          `[ERROR] Could not get German names for "${unique_name}" from Wikidata: `,
          error.message
        );
      })
      .finally(() => {
        if (germanNames.length === 0) {
          return;
        }
        const cleanedGermanNames = filterGermanNames(germanNames, unique_name);

        if (cleanedGermanNames.length > 0) {
          GermanNamesFound++;
          plant["common_name_de"] = cleanedGermanNames.join(", ");
        }
      });
  }
};

/**
 * Sets the 'common_name_de' property of every plant in the array.
 * Splits up the entire plants array into smaller arrays to improve performance for name fetching.
 *
 * @param {Array} plants - An array containing all plant objects.
 */
const fetchGermanNamesForPlantsConcurrent = async (plants) => {
  const MAX_CONCURRENT_REQUESTS = 25;

  console.log("[INFO] Start fetching German common names!");

  // Chunk the plants into batches of MAX_CONCURRENT_REQUESTS
  const chunks = [];
  const chunk_size = plants.length / MAX_CONCURRENT_REQUESTS + 1;
  for (let i = 0; i < plants.length; i += chunk_size) {
    chunks.push(plants.slice(i, i + chunk_size));
  }

  // Process each chunk concurrently using Promise.all
  await Promise.all(chunks.map((chunk) => processPlants(chunk)));

  console.log(
    `[INFO] Done! Found German names for ${GermanNamesFound} plants!`
  );
};

async function fetchGermanNames() {
  if (!fs.existsSync("data/overrides")) {
    fs.mkdirSync("data/overrides");
  }

  let plants = await csv().fromFile("data/mergedDatasets.csv");

  // plants = plants.slice(0, 100) // during developement

  await fetchGermanNamesForPlantsConcurrent(plants);

  return plants;
}

async function writePlantsToOverwriteCsv(plants) {
  console.log("[INFO] Writing german common names to CSV file...");
  console.log("[INFO] Total number of plants: ", plants.length);

  const opts = {
    fields: ["unique_name", "common_name_de"],
  };
  const csvFile = json2csv(plants, opts);
  fs.writeFileSync("data/overrides/01_germanCommonNames.csv", csvFile);

  return plants;
}

fetchGermanNames()
  .then((plants) => writePlantsToOverwriteCsv(plants))
  .catch((error) => console.error(error));
