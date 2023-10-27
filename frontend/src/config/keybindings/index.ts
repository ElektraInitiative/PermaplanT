import keybindings from './keybindings.json';
import { createKeyCombinationFromKeyEvent } from '@/utils/key-combinations';
import React from 'react';

export const KEYBINDING_SCOPE_PLANTING = 'planting';

type KeyBindings = Record<string, string>;

type KeyBindingConfig = {
  [scope: string]: string | KeyBindingConfig;
};

export const keyBindingConfig: KeyBindingConfig = keybindings;

/**
 * Creates a set of key event handlers based on the provided scope and a set of key handler actions.
 * These handlers are mapped to specific keyboard shortcuts defined in the configuration for the given scope.
 *
 * @param scope - The scope for which to create key event handlers.
 * @param keyHandlerActions - An object that maps action names to corresponding handler functions.
 *
 * @returns A record of key event handlers, where each key represents a keyboard shortcut defined in the
 *          scope's configuration, and the corresponding value is the handler function associated with the
 *          action triggered by that shortcut. If no matching keybindings are found for the given scope,
 *          an empty object is returned.
 */
export function createKeyHandlersFromConfig(
  scope: string,
  keyHandlerActions: Record<string, () => void>,
): Record<string, () => void> {
  const scopedKeybindings = getKeybindingsForScope(scope);

  if (scopedKeybindings) {
    return Object.keys(scopedKeybindings).reduce(
      (handlers: Record<string, () => void>, action: string) => {
        const handlerFunction = keyHandlerActions[action];
        if (handlerFunction) {
          const keys: string[] = getShortcutsForAction(scope, action);
          keys.forEach((key) => {
            handlers[key] = handlerFunction;
          });
        }
        return handlers;
      },
      {},
    );
  }

  return {};
}

/**
 * Retrieves the action name associated with a given keyboard shortcut within a specified scope.
 * @param scope - The scope in which to look for the keyboard shortcut.
 * @param shortcut - The keyboard shortcut to find the associated action for.
 * @returns The action name if found, or null if not found.
 */
export function getActionNameFromShortcut(scope: string, shortcut: string): string | null {
  const keybindings = getKeybindingsForScope(scope);

  return keybindings
    ? Object.entries(keybindings).find(([, key]) => key === shortcut)?.[0] || null
    : null;
}

/**
 * Retrieves the action name associated with a keyboard event within a specified scope.
 * @param scope - The scope in which to look for the associated action.
 * @param event - The keyboard event to map to an action.
 * @returns The action name if found, or null if not found.
 */
export function getActionNameFromKeyEvent(
  scope: string,
  event: React.KeyboardEvent,
): string | null {
  const shortcut = createKeyCombinationFromKeyEvent(event);
  const keybindings = getKeybindingsForScope(scope);

  return keybindings
    ? Object.entries(keybindings).find(([, keys]) =>
        getKeyListFromString(keys).includes(shortcut),
      )?.[0] || null
    : null;
}

/**
 * Retrieves the keyboard shortcuts associated with a specific action within a specified scope.
 * @param scope - The scope in which to look for the associated action's shortcut.
 * @param action - The action for which to find the associated keyboard shortcut.
 * @returns list of keyboard shortcuts
 */
export function getShortcutsForAction(scope: string, action: string): string[] {
  const keybindings = getKeybindingsForScope(scope);
  return (keybindings && getKeyListFromString(keybindings[action])) || [];
}

function getKeybindingsForScope(scope: string): KeyBindings | null {
  const keys = scope.split('.');
  let scopeObj: KeyBindingConfig | undefined = keyBindingConfig;

  for (const key of keys) {
    if (typeof scopeObj !== 'object' || scopeObj[key] === undefined) {
      return null;
    }
    scopeObj = scopeObj[key] as KeyBindingConfig;
  }

  return Object.fromEntries(
    Object.entries(scopeObj).filter(([, value]) => typeof value === 'string'),
  ) as KeyBindings;
}

function getKeyListFromString(keysString: string) {
  return keysString.split(',').map((item) => item.trim());
}
