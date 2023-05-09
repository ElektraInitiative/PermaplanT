import axios from 'axios';

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
        .replaceAll('&amp;', 'and')
        .replaceAll('&', 'and')
        .replaceAll(' ', '_')
        .replaceAll('(', '')
        .replaceAll(')', '')
        .replaceAll('-', '_')
        .replaceAll(/_+/g, '_')
        .toLowerCase();
      if (newKey !== key) {
        obj[newKey] = obj[key];
        delete obj[key];
      }
    });
    if (external_source) {
      obj['external_source'] = external_source;
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
  if (pH.includes('-')) {
    const [min, max] = pH.split('-').map(Number);
    pH = (min + max) / 2;
  } else if (pH.includes('–')) {
    // Handle em dash character
    const [min, max] = pH.split('–').map(Number);
    pH = (min + max) / 2;
  } else if (pH.includes('<')) {
    // Handle less than symbol
    pH = Number(pH.slice(1)) - 0.1;
  } else if (pH.includes('>')) {
    // Handle greater than symbol
    pH = Number(pH.slice(1)) + 0.1;
  } else {
    pH = Number(pH);
  }

  if (isNaN(pH) || pH < 0 || pH > 14) {
    // Handle invalid pH values
    return null;
  } else if (pH <= 5.0) {
    return 'very acid';
  } else if (pH >= 5.1 && pH <= 6.5) {
    return 'acid';
  } else if (pH >= 6.6 && pH <= 7.3) {
    return 'neutral';
  } else if (pH >= 7.4 && pH <= 7.8) {
    return 'alkaline';
  } else if (pH >= 7.9) {
    return 'very alkaline';
  } else {
    return null;
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
    const dewiki = await entity['sitelinks']['dewiki'];
    if (dewiki) {
      return dewiki.title;
    }
  } catch (error) {}
  return null;
}

export { sanitizeColumnNames, getSoilPH, fetchGermanName };
