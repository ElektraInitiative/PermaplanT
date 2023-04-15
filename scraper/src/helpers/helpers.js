/**
 * Sanitizes the column names of the json array
 *
 * @param {*} jsonArray
 * @returns
 */
function sanitizeColumnNames(jsonArray) {
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

export { sanitizeColumnNames, getSoilPH };
