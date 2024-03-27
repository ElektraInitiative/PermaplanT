import React from 'react';
import { useEffect } from 'react';

/**
 * Hook that alerts clicks outside of the passed ref
 * @param refs Refs of the elements that should not trigger the callback
 * if the click detected inside any of the refs, the callback will not be called
 * @param callback Callback to be called when a click outside of the refs occurs
 */
export function useOutsideClickAlerter(refs: React.RefObject<HTMLElement>[], callback: () => void) {
  const callbackRef = React.useRef<() => void>();
  const refsRef = React.useRef<React.RefObject<HTMLElement>[]>();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    refsRef.current = refs;
  }, [refs]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!refsRef.current) return;

      const shouldAlert = refsRef.current.reduce((acc, r) => {
        console.log(r.current?.contains(event.target as Node));

        return acc && !r.current?.contains(event.target as Node);
      }, true);

      if (shouldAlert) {
        callbackRef.current?.();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- we only want to run this effect if any of the refs change
  }, [...refs]);
}
