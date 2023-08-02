import axios from "axios";

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
 * Returns the height enum typ based on the height
 *
 * @param {string} height String containing the height value in meter
 * @returns {string}
 */
function getHeightEnumTyp(height) {
  const value = processValue(height);
  if (value === null) return null;

  return value <= 0.25 ? "low" : value <= 0.61 ? "medium" : "high";
}

/**
 * Returns the spread enum typ based on the spread/width
 *
 * @param {string} spread String containing the spread/width value in meter
 * @returns {string}
 */
function getSpreadEnumTyp(spread) {
  const value = processValue(spread);
  if (value === null) return null;

  return value <= 0.15 ? "narrow" : value <= 0.61 ? "medium" : "wide";
}

/**
 * Fetches the German name of the plant from wikidata API.
 *
 * @param {*} binomialName
 * @returns {Promise<string>} German name of the plant
 */
async function fetchGermanName(binomialName) {
  try {
    const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${binomialName}&language=en&format=json`;
    const response = await axios.get(url);
    const data = response.data;
    const results = data.search;
    if (results.length === 0) {
      return null;
    }
    const result = results[0];
    const id = result.id;
    const url2 = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${id}&languages=de&format=json`;
    const response2 = await axios.get(url2);
    const data2 = response2.data;
    const entities = data2.entities;
    const entity = entities[id];
    const dewiki = await entity["sitelinks"]["dewiki"];
    if (dewiki) {
      return dewiki.title;
    }
  } catch (error) {}
  return null;
}

export {
  sanitizeColumnNames,
  getSoilPH,
  getHeightEnumTyp,
  getSpreadEnumTyp,
  fetchGermanName,
};
