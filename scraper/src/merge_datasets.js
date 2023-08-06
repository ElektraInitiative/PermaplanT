import fs from "fs";
import { parse as json2csv } from "json2csv";
import csv from "csvtojson";
import permapeopleColumnMapping from "./helpers/column_mapping_permapeople.js";
import axios from "axios";
import axiosRetry from "axios-retry";
import {
  sanitizeColumnNames,
  getSoilPH,
  getHeightEnumTyp,
  getSpreadEnumTyp,
} from "./helpers/helpers.js";

/**
 * Defines the amount of retries we do, if axios encounters errors during a HTTP GET Request.
 * Increse Delay if we encounter error to prevent 429 Errors.
 */
axiosRetry(axios, {
  retries: 5, // number of retries
  retryDelay: (retryCount) => {
    return retryCount * 1000; // time interval between retries
  },
});

/**
 * Fetches the German name of the plant from wikidata API.
 * Sets the 'common_name_de of every plant in the array.
 *
 * @param {*} plants[]
 */
const fetchDataForPlantsArray = async (plants) => {
  let GermanNamesFound = 0;
  console.log("[INFO] Start fetching German common Names!");
  for (const plant of plants) {
    const unique_name = plant["unique_name"];
    if (unique_name == "") {
      continue;
    }

    try {
      await axios
        .get(
          `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${unique_name}&language=en&format=json`
        )
        .then((response) => {
          const data = response.data;
          const results = data.search;

          if (!results || results.length === 0) {
            return null;
          }

          const result = results[0];
          const id = result.id;

          axios
            .get(
              `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${id}&languages=de&format=json`
            )
            .then((response) => {
              const data = response.data;
              const entities = data.entities;
              const entity = entities[id];
              const dewiki = entity["sitelinks"]["dewiki"];

              if (dewiki) {
                const title = dewiki.title;
                let germanName = title.replace(/ \(.*\)/, "");
                germanName = germanName.replace('"', "");

                germanName = germanName.replace(unique_name, "");
                germanName = germanName.trim();
                if (!germanName || germanName === "true") {
                  return null;
                }
                GermanNamesFound++;
                //console.log(`${unique_name} is a ${germanName}`)
                plant["common_name_de"] = germanName;
              }
            })
            .catch((error) => {
              // The second request fails
              console.error("2. Request got an error " + error);
            });
        })
        .catch((error) => {
          // The first request fails
          console.error("1. Request got an error " + error);
        });
    } catch (error) {
      console.error("Error", error.message);
    }
  }
  console.log(`[INFO] Done! Found ${GermanNamesFound} German Names!`);
};

/**
 *  Custom rules to unify the value format of merged datasets.
 *
 * @param {*} plants - Array of plants
 * @param {*} columnMapping - Column mapping
 */
const unifyValueFormat = (plants, columnMapping) => {
  const mappedColumns = Object.keys(columnMapping).filter(
    (key) => columnMapping[key] !== null
  );
  plants.forEach((plant) => {
    mappedColumns.forEach((column) => {
      if (plant[column]) {
        if (!!columnMapping[column]["valueMapping"]) {
          plant[column] = plant[column]
            .split(",")
            .map((value) => {
              const updatedValue = value.trim().toLowerCase();
              if (
                columnMapping[column]["valueMapping"][updatedValue] ||
                columnMapping[column]["valueMapping"][updatedValue] === null
              ) {
                return columnMapping[column]["valueMapping"][updatedValue];
              }
              return value.trim();
            })
            .filter((value) => value !== null)
            .join(",");
        }

        if (column === "soil_ph") {
          plant[column] = getSoilPH(plant[column]);
        }
      }

      if (columnMapping[column]["newName"]) {
        plant[columnMapping[column]["newName"]] = plant[column];
        if (columnMapping[column]["newName"] !== column) {
          delete plant[column];
        }
      }
    });

    if ("height" in plant) {
      plant["height"] = getHeightEnumTyp(plant["height"]);
    }

    if ("spread" in plant) {
      plant["spread"] = getSpreadEnumTyp(plant["spread"]);
    }

    if ("width" in plant) {
      plant["spread"] = getSpreadEnumTyp(plant["width"]);
    }

    if (plant["unique_name"].startsWith("Papaver somnif. paeonifl.")) {
      plant["unique_name"] = plant["unique_name"].replace(
        "Papaver somnif. paeonifl.",
        "Papaver somniferum paeoniflorum"
      );
    } else if (plant["unique_name"].startsWith("Alcea rosea fl. pl.")) {
      plant["unique_name"] = plant["unique_name"].replace(
        "Alcea rosea fl. pl.",
        "Alcea rosea flore pleno"
      );
    } else if (plant["unique_name"].startsWith("Campanula lat. macr.")) {
      plant["unique_name"] = plant["unique_name"].replace(
        "Campanula lat. macr.",
        "Campanula latifolia macrantha"
      );
    } else if (plant["unique_name"].startsWith("Malva sylvestris ssp. maur.")) {
      plant["unique_name"] = plant["unique_name"].replace(
        "Malva sylvestris ssp. maur.",
        "Malva sylvestris mauritiana"
      );
    }
  });

  return plants;
};

/**
 * Renames the columns according to the column mapping
 *
 * @param {*} plants - Array of plants
 * @param {*} columnMapping - Column mapping
 * @returns - Array of plants
 */
const renameColumns = async (plants, columnMapping) => {
  const mappedColumns = Object.fromEntries(
    Object.entries(columnMapping).filter(([_, value]) => value !== null)
  );
  plants.forEach((plant) => {
    Object.keys(mappedColumns).forEach((column) => {
      plant[column] = plant[columnMapping[column]["map"]];
      if (column !== columnMapping[column]["map"]) {
        delete plant[columnMapping[column]["map"]];
      }
    });
  });
  return plants;
};

/**
 * Sanitize the values of the merged datasets.
 *
 * @param {*} plants - Array of plants
 * @returns - Array of plants
 */
const sanitizeValues = async (plants) => {
  const uniqueScientificNames = new Set();
  let sanitizedPlants = [];

  plants.forEach((plant) => {
    if (
      plant["scientific_name"] === "Citrullus lanatus" &&
      plant["name"] === "Blacktail" &&
      plant["slug"] === "blacktail"
    ) {
      return;
    }

    const scientificName = plant["scientific_name"];
    if (uniqueScientificNames.has(scientificName)) {
      if (
        plant["type"] === "Variety" ||
        (scientificName === "Brassica oleracea acephala" &&
          plant["name"] === "Taunton Deane Kale")
      ) {
        plant["type"] = "Variety";
        plant["scientific_name"] =
          plant["scientific_name"] + " '" + plant["name"] + "'";

        sanitizedPlants.push(plant);
      }
    } else {
      uniqueScientificNames.add(scientificName);
      sanitizedPlants.push(plant);
    }

    if (plant["edible"].split(",").length > 1) {
      plant["edible"] = plant["edible"].split(",")[0];
    }

    if (plant["medicinal"] && plant["medicinal"].toLowerCase() === "true") {
      plant["medicinal"] = null;
    }

    if (plant["leaves"]) {
      plant["leaves"] = plant["leaves"].toLowerCase();
    }
  });

  return sanitizedPlants;
};

/**
 * The function reads the datasets from the CSV files from the data folder and merges them based on the unique_name column.
 *
 * @returns - Array of plants
 */
async function mergeDatasets() {
  console.log("[INFO] Merging datasets...");

  let allPlants = [];

  let practicalPlants = await csv().fromFile("data/detail.csv"); // Practical plants dataset
  let permapeople = await csv().fromFile("data/permapeopleRawData.csv"); // Permapeople dataset
  let reinsaat = await csv().fromFile("data/reinsaatRawData.csv"); // Reinsaat dataset

  sanitizeColumnNames(practicalPlants, "practicalplants");
  sanitizeColumnNames(permapeople, "permapeople");
  sanitizeColumnNames(reinsaat, "reinsaat");

  console.log("[INFO] practicalPlants: ", practicalPlants.length);
  console.log("[INFO] permapeople: ", permapeople.length);
  console.log("[INFO] reinsaat: ", reinsaat.length);

  practicalPlants = await renameColumns(
    practicalPlants,
    permapeopleColumnMapping
  );
  permapeople = await sanitizeValues(permapeople);

  const mappedColumns = Object.fromEntries(
    Object.entries(permapeopleColumnMapping).filter(
      ([_, value]) => value !== null
    )
  );

  practicalPlants.forEach((plant) => {
    const scientific_name = plant["scientific_name"];
    const plantInPermapeople = permapeople.find(
      (plant) => plant["scientific_name"] === scientific_name
    );

    if (plantInPermapeople) {
      const mergedPlant = { ...plant };

      Object.keys(plantInPermapeople).forEach((key) => {
        if (
          key in mappedColumns &&
          mappedColumns[key]["priority"] === "permapeople" &&
          !!plantInPermapeople[key]
        ) {
          mergedPlant[key] = plantInPermapeople[key];
        } else if (
          key in mappedColumns &&
          mappedColumns[key]["priority"] === "practicalplants" &&
          !!plant[key]
        ) {
          mergedPlant[key] = plant[key];
        } else {
          mergedPlant[key] = plantInPermapeople[key] || plant[key];
        }
      });
      allPlants.push(mergedPlant);
    } else {
      allPlants.push({
        ...plant,
      });
    }
  });

  permapeople.forEach((plant) => {
    const scientific_name = plant["scientific_name"];
    const plantInPracticalPlants = practicalPlants.find(
      (plant) => plant["scientific_name"] === scientific_name
    );
    if (!plantInPracticalPlants) {
      allPlants.push({
        ...plant,
      });
    }
  });

  console.log(
    "[INFO] Merged practicalPlants and permapeople: ",
    allPlants.length
  );

  reinsaat.forEach((plant) => {
    const scientific_name = plant["scientific_name"];
    const plantInMerged = allPlants.find(
      (plant) => plant["scientific_name"] === scientific_name
    );
    if (!plantInMerged) {
      allPlants.push({
        ...plant,
      });
    } else {
      Object.keys(plant).forEach((key) => {
        if (plant[key] && !plantInMerged[key]) {
          plantInMerged[key] = plant[key];
        }
      });
    }
  });

  return allPlants;
}

/**
 * The function writes the merged dataset to a CSV file.
 *
 * @param {*} plants - Array of plants
 */
async function writePlantsToCsv(plants) {
  if (!fs.existsSync("data")) {
    fs.mkdirSync("data");
  }

  //const PlantsNew = plants.slice(0, 100);
  //let updatedPlants = unifyValueFormat(PlantsNew, permapeopleColumnMapping);

  let updatedPlants = unifyValueFormat(plants, permapeopleColumnMapping);

  await fetchDataForPlantsArray(updatedPlants);

  console.log("[INFO] Writing merged dataset to CSV file...");
  console.log("[INFO] Total number of plants: ", updatedPlants.length);

  const csv = json2csv(updatedPlants);
  //fs.writeFileSync("data/mergedDatasets2.csv", csv);
  fs.writeFileSync("data/mergedDatasets.csv", csv);

  return updatedPlants;
}

mergeDatasets()
  .then((plants) => writePlantsToCsv(plants))
  .catch((error) => console.error(error));
