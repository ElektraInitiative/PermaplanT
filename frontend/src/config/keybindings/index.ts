import React from 'react';
import { useTranslation } from 'react-i18next';
import { createShortcutIncludingModifierKeysFromKeyEvent } from '@/utils/key-combinations';
import keybindings from './keybindings.json';

export const KEYBINDINGS_SCOPE_GLOBAL = 'global';
export const KEYBINDINGS_SCOPE_PLANTS_LAYER = 'plants_layer';
export const KEYBINDINGS_SCOPE_BASE_LAYER = 'base_layer';

type KeyBinding = Record<string, string[]>;

enum SpecialKeys {
  Escape = 'Escape',
  Delete = 'Delete',
  Shift = 'Shift',
  Control = 'Control',
}

type KeyBindingsConfig = {
  [scope: string]: KeyBinding;
};

export const keyBindingsConfig: KeyBindingsConfig = keybindings;

/**
 * Creates a set of key event handlers based on the provided scope and a set of key handler actions.
 * These handlers are mapped to specific keyboard shortcuts defined in the configuration for the given scope.
 *
 * @param scope - The scope for which to create key event handlers.
 * @param keyBindingsActions - An object that maps action names to corresponding handler functions.
 *
 * @returns A record of key event handlers, where each key represents a keyboard shortcut defined in the
 *          scope's configuration, and the corresponding value is the handler function associated with the
 *          action triggered by that shortcut. If no matching keybindings are found for the given scope,
 *          an empty object is returned.
 */
export function createKeyBindingsAccordingToConfig(
  scope: string,
  keyBindingsActions: Record<string, (() => void) | undefined>,
): Record<string, () => void> {
  const configuredKeybindings = keyBindingsConfig[scope];

  if (configuredKeybindings) {
    return Object.keys(configuredKeybindings).reduce(
      (handlers: Record<string, () => void>, action: string) => {
        const handlerFunction = keyBindingsActions[action];
        if (handlerFunction) {
          const configuredShortcuts: string[] = configuredKeybindings[action];
          configuredShortcuts.forEach((key) => {
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

function getConfiguredKeybindingsForAction(scope: string, action: string): string[] {
  return keyBindingsConfig[scope][action];
}

/**
 * Retrieves formatted string containing keyboard shortcuts associated with a specific action.
 * @param scope - The scope in which to look for the associated action's shortcut.
 * @param action - The action for which to find the associated keyboard shortcut.
 * @param descriptionText - Optional description text to include in the formatted string.
 * @returns The string including the keyboard shortcut if found, or just the description text if not found.
 *         If no description text is provided, the tooltip will only include the keyboard shortcut.
 *
 * */
export function useGetFormattedKeybindingDescriptionForAction(
  scope: string,
  action: string,
  descriptionText?: string,
): string {
  const keybindings = getConfiguredKeybindingsForAction(scope, action);
  const { t } = useTranslation(['keybindings']);

  const translatedKeybindings = keybindings.map((keybinding) => {
    const parts = keybinding.split('+');
    return parts
      .map((part) => {
        if (Object.values(SpecialKeys).includes(part as SpecialKeys)) {
          return t(`keybindings:${part as SpecialKeys}`);
        }
        return part;
      })
      .join('+');
  });

  return `${descriptionText || ''} (${translatedKeybindings.join(',')})`.trim();
}

/**
 * Retrieves the action name associated with a given keyboard shortcut within a specified scope.
 * @param scope - The scope in which to look for the keyboard shortcut.
 * @param shortcut - The keyboard shortcut to find the associated action for.
 * @returns The action name if found, or undefined if not found.
 */
export function getConfiguredActionForShortcut(
  scope: string,
  shortcut: string,
): string | undefined {
  const keybindings = keyBindingsConfig[scope];

  if (!keybindings) return undefined;

  return Object.entries(keybindings).find(([, configuredShortcuts]) =>
    configuredShortcuts.includes(shortcut),
  )?.[0];
}

/**
 * Retrieves the action name associated with a keyboard event within a specified scope.
 * @param scope - The scope in which to look for the associated action.
 * @param event - The keyboard event to map to an action.
 * @returns The action name if found, or undefined if not found.
 */
export function getConfiguredActionFromKeyEvent(
  scope: string,
  event: React.KeyboardEvent,
): string | undefined {
  const pressedShortcut = createShortcutIncludingModifierKeysFromKeyEvent(event);
  return getConfiguredActionForShortcut(scope, pressedShortcut);
}
