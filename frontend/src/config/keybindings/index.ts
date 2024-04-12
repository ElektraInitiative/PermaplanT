import React from 'react';
import { useTranslation } from 'react-i18next';
import keybindingsMacOS from './keybindings_macos.json';
import keybindingsWindowsLinux from './keybindings_windows_linux.json';

export const KEYBINDINGS_SCOPE_GLOBAL = 'global';
export const KEYBINDINGS_SCOPE_PLANTS_LAYER = 'plants_layer';
export const KEYBINDINGS_SCOPE_DRAWING_LAYER = 'drawing_layer';
export const KEYBINDINGS_SCOPE_BASE_LAYER = 'base_layer';

type KeyBinding = Record<string, string[]>;

enum SpecialKeys_WindowsLinux {
  Escape = 'Escape',
  Delete = 'Delete',
  Shift = 'Shift',
  Control = 'Control',
}

enum SpecialKeys_MacOS {
  Escape = 'Escape',
  Delete = 'Delete',
  Shift = 'Shift',
  Control = 'Control',
  Cmd = 'Cmd',
  Opt = 'Opt',
}

type KeyBindingsConfig = {
  [scope: string]: KeyBinding;
};

const isMacOS = navigator.userAgent.includes('Macintosh');
export const keyBindingsConfig: KeyBindingsConfig = isMacOS
  ? keybindingsMacOS
  : keybindingsWindowsLinux;

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

    if (isMacOS) {
      return parts
        .map((part) => {
          if (Object.values(SpecialKeys_MacOS).includes(part as SpecialKeys_MacOS)) {
            return t(`keybindings:macos.${part as SpecialKeys_MacOS}`);
          }
          return part;
        })
        .join('+');
    } else {
      return parts
        .map((part) => {
          if (Object.values(SpecialKeys_WindowsLinux).includes(part as SpecialKeys_WindowsLinux)) {
            return t(`keybindings:windows_linux.${part as SpecialKeys_WindowsLinux}`);
          }
          return part;
        })
        .join('+');
    }
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

/**
 * Create a key combination string from a React KeyboardEvent object.
 *
 * @param event - The React KeyboardEvent object to extract key combination from.
 * @returns A string representing the key combination, including modifier keys (Ctrl, Shift, Alt) if pressed, and the primary key.
 */
export function createShortcutIncludingModifierKeysFromKeyEvent(event: React.KeyboardEvent) {
  return createShortcutIncludingModifierKeys(
    event.ctrlKey,
    event.altKey,
    event.shiftKey,
    event.metaKey,
    event.key,
  );
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
export function createShortcutIncludingModifierKeys(
  ctrlKey: boolean,
  altKey: boolean,
  shiftKey: boolean,
  metaKey: boolean,
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
    modifierKeys.push(isMacOS ? 'Opt' : 'Alt');
  }

  if (metaKey) {
    modifierKeys.push(isMacOS ? 'Cmd' : 'Meta');
  }

  modifierKeys.push(key);

  return modifierKeys.join('+');
}
