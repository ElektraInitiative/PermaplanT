import { LayerType } from '@/api_types/definitions';
import { isLayerOfTypeActive } from '@/features/map_planning/utils/layer-utils';
import { createShortcutIncludingModifierKeys } from '@/utils/key-combinations';
import { useEffect } from 'react';

/**
 * Custom React Hook: useKeyHandlers
 *
 * This hook allows you to manage key press event handlers in your React components.
 * It takes a mapping of key names to callback functions, and when a corresponding key is
 * pressed, it triggers the associated callback.
 *
 * @param {Record<string, () => void>} keyHandlerMap - A dictionary where keys are key names
 *     (e.g., 'Enter', 'Escape') and values are callback functions to be executed when the
 *     corresponding key is pressed.
 *
 * @param {HTMLElement | Document} htmlNode - The HTML node to which the event listener should be bound.
 *
 * @param {LayerType} activeLayer - Only trigger the key handler if this layer is active.
 *
 * @example
 * // Example usage:
 * const handleEnter = () => {
 *   // Do something when 'Enter' key is pressed
 * };
 *
 * const handleEscape = () => {
 *   // Do something when 'Escape' key is pressed
 * };
 *
 * const keyHandlers = {
 *   Enter: handleEnter,
 *   Escape: handleEscape,
 * };
 *
 * function MyComponent() {
 *   useKeyHandlers(keyHandlers);
 *
 *   return (
 *     <div>
 *       // Your component content
 *     </div>
 *   );
 * }
 * */

export function useKeyHandlers(
  keyHandlerMap: Record<string, (() => void) | undefined>,
  htmlNode: HTMLElement | Document = document,
  activeLayer?: LayerType,
  stopPropagation?: boolean,
) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const pressedShortcut = createShortcutIncludingModifierKeys(
        event.ctrlKey,
        event.altKey,
        event.shiftKey,
        event.key,
      );
      const handler = keyHandlerMap[pressedShortcut];
      if (handler && (!activeLayer || isLayerOfTypeActive(activeLayer))) {
        handler();
        if (stopPropagation === true) {
          event.stopPropagation();
        }
      }
    };

    htmlNode.addEventListener('keydown', handleKeyPress as EventListener);

    return () => {
      htmlNode.removeEventListener('keydown', handleKeyPress as EventListener);
    };
  }, [htmlNode, keyHandlerMap, stopPropagation, activeLayer]);
}
