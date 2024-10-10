import { Person } from '../types/Person';

export function filterPeople(
  people: Person[],
  { appliedQuery }: { appliedQuery: string },
) {
  let filteredPeople = [...people];

  if (appliedQuery) {
    const normalizedQuery = appliedQuery.toLocaleLowerCase().trim();

    filteredPeople = filteredPeople.filter(person =>
      person.name.toLocaleLowerCase().includes(normalizedQuery),
    );
  }

  return filteredPeople;
}
