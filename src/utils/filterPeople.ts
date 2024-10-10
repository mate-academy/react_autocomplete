import { Person } from '../types/Person';

export function filterPeople(
  people: Person[],
  { appliedQuery }: { appliedQuery: string },
) {
  let filteredPeople = [...people];
  const normalizedQuery = appliedQuery.toLocaleLowerCase().trim();

  if (normalizedQuery.length) {
    filteredPeople = filteredPeople.filter(person =>
      person.name.toLocaleLowerCase().includes(normalizedQuery),
    );
  }

  return filteredPeople;
}
