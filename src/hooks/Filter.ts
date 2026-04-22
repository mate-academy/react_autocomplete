import { useMemo } from 'react';
import { Person } from '../types/Person';

export const useFilter = (people: Person[], query: string) => {
  return useMemo(() => {
    if (!query.trim()) {
      return people; // 👈 show all when empty
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [people, query]);
};
