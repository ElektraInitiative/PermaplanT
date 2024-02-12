import fs from "fs";
import { parse as json2csv } from "json2csv";
import csv from "csvtojson";
import permapeopleColumnMapping from "./helpers/column_mapping_permapeople.js";
import {
  sanitizeColumnNames,
  getSoilPH,
  getHeightEnumTyp,
  getSpreadEnumTyp,
  capitalizeWords,
} from "./helpers/helpers.js";

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
 * Cleans up a JSON array entries for smoother CSV export.
 *
 * @param {Array} plants - Array of plants
 */
function cleanUpJsonForCsv(plants) {
  const columns = Object.keys(plants[0]);
  plants.forEach((plant, index) => {
    delete plant.subfamily;
    columns.forEach((column) => {
      if (plant[column] === "") {
        plant[column] = null;
      }
    });
  });
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

  //const slicedPlants = plants.slice(0,100)

  let updatedPlants = unifyValueFormat(plants, permapeopleColumnMapping);
  cleanUpJsonForCsv(updatedPlants);

  console.log("[INFO] Writing merged dataset to CSV file...");
  console.log("[INFO] Total number of plants: ", updatedPlants.length);

  const csv = json2csv(updatedPlants);
  fs.writeFileSync("data/mergedDatasets.csv", csv);

  return updatedPlants;
}

mergeDatasets()
  .then((plants) => writePlantsToCsv(plants))
  .catch((error) => console.error(error));
