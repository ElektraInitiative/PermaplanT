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
 * Returns the soil pH category based on the pH value
 *
 * @param {*} pH String containing the pH value
 * @returns
 */
function getSoilPH(pH) {
  // If pH is a range, split it into two numbers and calculate the average
  if (pH.includes("-")) {
    const [min, max] = pH.split("-").map(Number);
    pH = (min + max) / 2;
  } else if (pH.includes("–")) {
    // Handle em dash character
    const [min, max] = pH.split("–").map(Number);
    pH = (min + max) / 2;
  } else if (pH.includes("<")) {
    // Handle less than symbol
    pH = Number(pH.slice(1)) - 0.1;
  } else if (pH.includes(">")) {
    // Handle greater than symbol
    pH = Number(pH.slice(1)) + 0.1;
  } else {
    pH = Number(pH);
  }

  if (isNaN(pH) || pH < 0 || pH > 14) {
    // Handle invalid pH values
    return null;
  } else if (pH <= 5.0) {
    return "very acid";
  } else if (pH >= 5.1 && pH <= 6.5) {
    return "acid";
  } else if (pH >= 6.6 && pH <= 7.3) {
    return "neutral";
  } else if (pH >= 7.4 && pH <= 7.8) {
    return "alkaline";
  } else if (pH >= 7.9) {
    return "very alkaline";
  } else {
    return null;
  }
}

/**
 * Returns the height enum typ based on the height
 *
 * @param {*} height String containing the height value in meter
 * @returns
 */
function getHeightEnumTyp(height) {
  if (height == null) {
    return "na";
  }
  // If Height is a range, split it into two numbers and calculate the average
  if (height.includes("-")) {
    const [min, max] = height.split("-").map(Number);
    height = (min + max) / 2;
  } else if (height.includes("–")) {
    // Handle em dash character
    const [min, max] = height.split("–").map(Number);
    height = (min + max) / 2;
  } else if (height.includes("<")) {
    // Handle less than symbol
    height = Number(height.slice(1)) - 0.1;
  } else if (height.includes(">")) {
    // Handle greater than symbol
    height = Number(height.slice(1)) + 0.1;
  } else {
    height = Number(height);
  }

  if (isNaN(height) || height < 0) {
    // Handle invalid height values
    return "na";
  } else if (height <= 0.25) {
    return "low";
  } else if (height > 0.25 && height <= 0.61) {
    return "medium";
  } else if (height > 0.61) {
    return "high";
  } else {
    return "na";
  }
}

/**
 * Returns the spread enum typ based on the spread/width
 *
 * @param {*} spread String containing the spread/width value in meter
 * @returns
 */
function getSpreadEnumTyp(spread) {
  if (spread == null) {
    return "na";
  }
  // If Height is a range, split it into two numbers and calculate the average
  if (spread.includes("-")) {
    const [min, max] = spread.split("-").map(Number);
    spread = (min + max) / 2;
  } else if (spread.includes("–")) {
    // Handle em dash character
    const [min, max] = spread.split("–").map(Number);
    spread = (min + max) / 2;
  } else if (spread.includes("<")) {
    // Handle less than symbol
    spread = Number(spread.slice(1)) - 0.1;
  } else if (spread.includes(">")) {
    // Handle greater than symbol
    spread = Number(spread.slice(1)) + 0.1;
  } else if (spread.includes("m")) {
    // Handle m for meter
    spread = Number(spread.slice(0, -1));
  } else {
    spread = Number(spread);
  }

  if (isNaN(spread) || spread < 0) {
    // Handle invalid spread values
    return "na";
  } else if (spread <= 0.15) {
    return "narrow";
  } else if (spread > 0.15 && spread <= 0.61) {
    return "medium";
  } else if (spread > 0.61) {
    return "wide";
  } else {
    return "na";
  }
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
