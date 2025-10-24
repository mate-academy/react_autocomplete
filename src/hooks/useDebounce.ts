import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => setDebounced(value), delay);

    return () => clearTimeout(timerId);
  }, [value, delay]);

  return debounced;
}
