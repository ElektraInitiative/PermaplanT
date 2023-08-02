import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

/**
 * Takes a value, a function and a delay and runs the function after the delay as long as the function does not change.
 * Unmounting the component before the delay is over will run the function immediately.
 */
function useDebounceEffect(
  effect: EffectCallback,
  delay: number,
  deps?: DependencyList | undefined,
) {
  const effectRef = useRef(effect);
  const didRunRef = useRef(false);

  useEffect(() => {
    effectRef.current = effect;
  }, [effect]);

  useEffect(() => {
    return () => {
      if (!didRunRef.current) {
        effectRef.current?.();
      }
    };
  }, []);

  useEffect(() => {
    let cleanup: void | (() => void);
    const timeout = setTimeout(() => {
      cleanup = effectRef.current?.();
      didRunRef.current = true;
    }, delay);

    return () => {
      clearTimeout(timeout);
      didRunRef.current = false;
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, ...(deps ?? [])]);

  return;
}

export default useDebounceEffect;
