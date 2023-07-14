import { DependencyList, EffectCallback, useEffect } from 'react';

/**
 * Takes a value, a function and a delay and runs the function after the delay as long as the function does not change.
 */
function useDebounceEffect(
  effect: EffectCallback,
  delay: number,
  deps?: DependencyList | undefined,
) {
  useEffect(() => {
    let cleanup: void | (() => void);
    const timeout = setTimeout(() => {
      cleanup = effect();
    }, delay);

    return () => {
      clearTimeout(timeout);
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effect, delay, ...(deps ?? [])]);

  return;
}

export default useDebounceEffect;
