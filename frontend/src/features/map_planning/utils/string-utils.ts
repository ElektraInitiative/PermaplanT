/*+
 * Capitalizes the first char of a string (E.g. "lorem ipsum" -> "Lorem ipsum").
 */
export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
