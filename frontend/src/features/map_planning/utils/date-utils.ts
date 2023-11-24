/**
 * Takes a string in the format of "YYYY-MM-DD" and converts it to a Date object.
 */
export function convertToDate(date: string) {
  const [year, month, day] = date.split('-');
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

/**
 * Takes a Date object and converts it to a string in the format of "YYYY-MM-DD".
 */
export function convertToDateString(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Returns the short name of a month in the given language.
 *
 * @param monthNumber month from 1 to 12
 * @param language language code, e.g. 'en-US'
 * @returns short name of month in given language (e.g. 'Jan')
 */

export function getShortMonthNameFromNumber(monthNumber: number, language?: string) {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  return date.toLocaleString(language, { month: 'short' });
}
