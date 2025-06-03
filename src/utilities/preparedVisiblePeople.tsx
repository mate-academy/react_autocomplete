import { Person } from '../types/Person';

export const preparedVisiblePeople = (
  people: Person[],
  appliedQuery: string,
) => {
  const visiblePeople = [...people];
  const normalizedQuery = appliedQuery.trim().toLowerCase();

  if (appliedQuery) {
    return visiblePeople.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  }

  return visiblePeople;
};
