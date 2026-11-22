import { useEffect, useState } from 'react';

/**
 * Syncs React state with localStorage while safely handling JSON and storage errors.
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return initialValue;
      }
      const parsed = JSON.parse(item);
      return parsed ?? initialValue;
    } catch (error) {
      console.error(`Failed to read localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Failed to write localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
