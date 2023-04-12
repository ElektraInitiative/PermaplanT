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
      obj[newKey] = obj[key];
      delete obj[key];
    });
    return obj;
  });
}

export { sanitizeColumnNames };
