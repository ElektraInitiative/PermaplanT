import { useEffect } from 'react';

export function useKeyHandlers(keyHandlerMap: Record<string, () => void>) {
  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      const handler = keyHandlerMap[event.key];
      if (handler) {
        handler();
      }
    }

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [keyHandlerMap]);
}
