import { useState, useEffect } from 'react';
import { UI_CONSTANTS } from '../utils/constants';

export const useDebounce = (value, delay = UI_CONSTANTS.DEBOUNCE_DELAY) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}; 