import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

const PIN_STORAGE_KEY = 'keep_clone_hidden_pin_v1';
const PIN_REGEX = /^\d{4}$/;

/**
 * Persists and validates the 4-digit PIN used to unlock hidden notes.
 */
export function useHiddenPin() {
  const [storedPin, setStoredPin] = useLocalStorage(PIN_STORAGE_KEY, null);

  const hasPin = typeof storedPin === 'string' && PIN_REGEX.test(storedPin);

  const savePin = useCallback(
    (nextPin) => {
      if (typeof nextPin !== 'string' || !PIN_REGEX.test(nextPin)) {
        return false;
      }
      setStoredPin(nextPin);
      return true;
    },
    [setStoredPin]
  );

  const verifyPin = useCallback(
    (candidatePin) => {
      if (!hasPin || typeof candidatePin !== 'string') {
        return false;
      }
      return candidatePin === storedPin;
    },
    [hasPin, storedPin]
  );

  return {
    hasPin,
    savePin,
    verifyPin,
  };
}
