/**
 * Create a key combination string from a React KeyboardEvent object.
 *
 * @param event - The React KeyboardEvent object to extract key combination from.
 * @returns A string representing the key combination, including modifier keys (Ctrl, Shift, Alt) if pressed, and the primary key.
 */
export function createKeyCombinationFromKeyEvent(event: React.KeyboardEvent) {
  return createKeyCombinationString(event.ctrlKey, event.altKey, event.shiftKey, event.key);
}

/**
 * Creates a key combination string based on modifier keys and a main key.
 *
 * @param ctrlKey - Indicates if the Ctrl key is pressed.
 * @param altKey - Indicates if the Alt key is pressed.
 * @param shiftKey - Indicates if the Shift key is pressed.
 * @param key - The main key pressed.
 * @returns {string} - A string representing the key combination.
 *
 * @example
 * const keyString = createKeyCombinationString(true, false, true, 'A');
 * // Returns 'Ctrl+Shift+A'
 */
export function createKeyCombinationString(
  ctrlKey: boolean,
  altKey: boolean,
  shiftKey: boolean,
  key: string,
) {
  const modifierKeys = [];

  if (ctrlKey) {
    modifierKeys.push('Ctrl');
  }

  if (shiftKey) {
    modifierKeys.push('Shift');
  }

  if (altKey) {
    modifierKeys.push('Alt');
  }

  modifierKeys.push(key);

  return modifierKeys.join('+');
}
