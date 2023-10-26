// Utility function to create a key combination string
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
