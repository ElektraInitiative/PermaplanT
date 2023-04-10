import { useEffect, useState } from 'react';

/**
 * Takes a value and a delay and returns a debounced value.
 * If no new value or delay is provided, the debounced value
 * is updated after the delay has passed.
 *
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value
 */
function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebouncedValue;
