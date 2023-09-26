import { useEffect, useState } from 'react';

export const useDebounce = (query: string, delay: number) => {
  const [debouncedQuery, setDebouncedQuery] = useState<string>(query);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery((query));
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [query, delay]);

  return debouncedQuery;
};
