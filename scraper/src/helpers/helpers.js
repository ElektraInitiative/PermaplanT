import csv from "csvtojson";

/*
 * Reads a CSV file and returns a JSON array.
 * Logs filename on error and exits the process.
 */
async function readCsv(file) {
  try {
    return await csv().fromFile(file);
  } catch (error) {
    console.error(`[ERROR] Error reading CSV file '${file}': ${error}`);
    process.exit(1);
  }
}

/**
 * Capitalizes the first character of every word in a string.
 *
 * @param {string} str - The input string.
 * @returns {string} The string with first characters of every word capitalized.
 */
function capitalizeWords(str) {
  const wordsArray = str.split(" ");

  for (let i = 0; i < wordsArray.length; i++) {
    const word = wordsArray[i];
    wordsArray[i] = word.charAt(0).toUpperCase() + word.slice(1);
  }

  return wordsArray.join(" ");
}

/**
 * Sanitizes the column names of the json array
 *
 * @param {*} jsonArray
 * @returns
 */
function sanitizeColumnNames(jsonArray, external_source = null) {
  return jsonArray.map((obj) => {
    const keys = Object.keys(obj);
    keys.forEach((key) => {
      let newKey = key
        .replaceAll("&amp;", "and")
        .replaceAll("&", "and")
        .replaceAll(" ", "_")
        .replaceAll("(", "")
        .replaceAll(")", "")
        .replaceAll("-", "_")
        .replaceAll(/_+/g, "_")
        .toLowerCase();
      if (newKey !== key) {
        obj[newKey] = obj[key];
        delete obj[key];
      }
    });
    if (external_source) {
      obj["external_source"] = external_source;
    }
    return obj;
  });
}

/**
 * Returns the average number from a string that may include range or single number.
 *
 * @param {string} value
 * @returns {number}
 */
function processValue(value) {
  let processedValue;
  if (value == null) return null;

  if (value.includes("-") || value.includes("–")) {
    const delimiter = value.includes("-") ? "-" : "–";
    const [min, max] = value.split(delimiter).map(Number);
    processedValue = (min + max) / 2;
  } else if (value.includes("<")) {
    processedValue = Number(value.slice(1)) - 0.1;
  } else if (value.includes(">")) {
    processedValue = Number(value.slice(1)) + 0.1;
  } else {
    processedValue = Number(value);
  }

  return isNaN(processedValue) || processedValue < 0 ? null : processedValue;
}

/**
 * Returns the soil pH category based on the pH value
 *
 * @param {string} pH String containing the pH value
 * @returns {string}
 */
function getSoilPH(pH) {
  const value = processValue(pH);
  if (value === null || value > 14) return null;

  return value <= 5
    ? "very acid"
    : value <= 6.5
    ? "acid"
    : value <= 7.3
    ? "neutral"
    : value <= 7.8
    ? "alkaline"
    : "very alkaline";
}

/**
 * Returns a plant measurement (height or spread) in cm
 *
 * @param {string} measurement String containing the spread/width value in meter
 * @returns {string}
 */
function processMeasurement(value) {
  const processedValue = processValue(value);
  if (processedValue === null) return null;

  return Math.round(processedValue * 100);
}

/**
 * Cleans up a JSON array entries for smoother CSV export.
 * - Changes empty strings to null
 * - Removes the subfamily column
 * - Trims unique_name column
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
      } else if (column === "unique_name") {
        plant[column] = plant[column].trim();
      }
    });
  });
}

export {
  sanitizeColumnNames,
  getSoilPH,
  capitalizeWords,
  cleanUpJsonForCsv,
  processMeasurement,
  readCsv,
};
