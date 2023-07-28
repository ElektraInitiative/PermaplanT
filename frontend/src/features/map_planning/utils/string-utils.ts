/*+
 * Capitalizes the first char of a string (E.g. "lorem ipsum" -> "Lorem ipsum").
 */
export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/*+
 * Capitalizes all words of a string (E.g. "lorem ipsum" -> "Lorem Ipsum").
 *
 * CAUTION: This function assumes that no whitespace besides the ' ' character is part of the string
 *          and that every character sequence between whitespace is a word.
 */
export function capitalize(str: string): string {
  return str
    .split(' ')
    .map((word) => capitalizeFirstLetter(word))
    .join(' ');
}
