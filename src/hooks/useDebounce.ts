
import { useState, useEffect } from 'react';

/**
 * A hook that delays updating a value until a specified delay has passed.
 * Useful for search inputs to reduce API calls while typing.
 *
 * @param value The value to debounce
 * @param delay The delay time in milliseconds
 * @param enabled Optional flag to enable/disable debouncing (defaults to true)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number, enabled: boolean = true): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // If debouncing is disabled, update the value immediately
    if (!enabled) {
      setDebouncedValue(value);
      return;
    }
    
    // Set a timeout to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if the value changes before the delay is up
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay, enabled]);

  return debouncedValue;
}
