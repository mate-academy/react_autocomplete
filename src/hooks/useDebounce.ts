import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, DELAY_TIME = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), DELAY_TIME);

    return () => window.clearTimeout(id);
  }, [value, DELAY_TIME]);

  return debounced;
}
