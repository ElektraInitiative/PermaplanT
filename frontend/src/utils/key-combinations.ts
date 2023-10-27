/**
 * Create a key combination string from a React KeyboardEvent object.
 *
 * @param event - The React KeyboardEvent object to extract key combination from.
 * @returns A string representing the key combination, including modifier keys (Ctrl, Shift, Alt) if pressed, and the primary key.
 */
export function createKeyCombinationFromKeyEvent(event: React.KeyboardEvent) {
  const modifierKeys = [];

  if (event.ctrlKey) {
    modifierKeys.push('Ctrl');
  }

  if (event.shiftKey) {
    modifierKeys.push('Shift');
  }

  if (event.altKey) {
    modifierKeys.push('Alt');
  }

  modifierKeys.push(event.key);

  return modifierKeys.join('+');
}
