import { createKeyCombinationFromKeyEvent } from '@/utils/key-combinations';
import React from 'react';

export const KEYBINDING_SCOPE_PLANTING = 'planting';

type KeyBindings = Record<string, string>;

type KeyBindingConfig = {
  [scope: string]: string | KeyBindingConfig;
};

export const keyBindingConfig: KeyBindingConfig = {
  planting: {
    exitPlantingMode: 'Escape',
    search: {
      clearSearch: 'Escape',
    },
  },
};

/**
 * Creates a set of key event handlers based on a given scope and a set of predefined key handler actions.
 *
 * @param scope - The scope for which the key handlers are defined, typically representing a specific context or component.
 * @param keyHandlerActions - A record of key handler actions, where keys are the names of key bindings, and values are corresponding handler functions.
 * @returns A record of key event handlers, where keys are key binding names, and values are functions that define the actions to be taken when those keys are pressed within the specified scope.
 *
 * @example
 * // Sample Config
 * keyBindingConfig = {
 *   planting: {
 *     key1: 'action1',
 *     key2: 'action2',
 *   },
 * };
 *
 * //Actions
 * const keyHandlerActions: Record<string, () => void> = {
 *   action1: () => {
 *     console.log('Action 1 executed');
 *   },
 *   action2: () => {
 *     console.log('Action 2 executed');
 *   },
 * };
 *
 * // Specify the scope for which you want to create key handlers
 * const scope = 'planting';
 *
 * // Use the createKeyHandlersFromConfig method to generate key event handlers
 * const keyHandlers = createKeyHandlersFromConfig(scope, keyHandlerActions);
 *
 * // Example: Listen for keydown events and execute the corresponding key handler
 * document.addEventListener('keydown', (event) => {
 *   const key = event.key;
 *   if (keyHandlers[key]) {
 *     keyHandlers[key]();
 *   }
 * });
 */
export function createKeyHandlersFromConfig(
  scope: string,
  keyHandlerActions: Record<string, () => void>,
): Record<string, () => void> {
  const scopedKeybindings = getKeybindingsForScope(scope);
  if (scopedKeybindings) {
    return Object.keys(scopedKeybindings).reduce(
      (handlers: Record<string, () => void>, key: string) => {
        const handlerFunction = keyHandlerActions[scopedKeybindings[key]];
        if (handlerFunction) {
          handlers[key] = handlerFunction;
        }
        return handlers;
      },
      {},
    );
  }

  return {};
}

export function getActionNameFromShortcut(scope: string, shortcut: string): string | null {
  const keybindings = getKeybindingsForScope(scope);

  return keybindings
    ? Object.entries(keybindings).find(([, key]) => key === shortcut)?.[0] || null
    : null;
}

export function getActionNameFromKeyEvent(
  scope: string,
  event: React.KeyboardEvent,
): string | null {
  const shortcut = createKeyCombinationFromKeyEvent(event);
  const keybindings = getKeybindingsForScope(scope);

  return keybindings
    ? Object.entries(keybindings).find(([, key]) => key === shortcut)?.[0] || null
    : null;
}

export function getShortcutForAction(scope: string, action: string): string | null {
  const keybindings = getKeybindingsForScope(scope);
  return (keybindings && keybindings[action]) || null;
}

function getKeybindingsForScope(scope: string): KeyBindings | null {
  const keys = scope.split('.');
  let scopeObj = keyBindingConfig;

  for (const key of keys) {
    if (scopeObj[key] && typeof scopeObj[key] === 'object') {
      scopeObj = scopeObj[key] as KeyBindingConfig;
    } else {
      return null;
    }
  }

  const filteredScopeObj = Object.entries(scopeObj)
    .filter(([, value]) => typeof value === 'string')
    .reduce((acc, [action, value]) => ({ ...acc, [action]: value }), {});

  return filteredScopeObj;
}
