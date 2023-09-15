import { useMemo } from 'react';

import { Person } from '../types/Person';

export const useFilteredPeople = (people: Person[], preparedQuery: string) => {
  const filteredPeople = useMemo(() => {
    return people.filter(human => {
      return human.name.toLowerCase().includes(preparedQuery.toLowerCase());
    });
  }, [people, preparedQuery]);

  return filteredPeople;
};
