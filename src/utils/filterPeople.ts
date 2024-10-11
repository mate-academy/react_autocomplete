/* eslint-disable @typescript-eslint/indent */
import { Person } from '../types/Person';

export function filterPeople(
  people: Person[],
  { appliedQuery }: { appliedQuery: string },
) {
  const normalizedQuery = appliedQuery.toLocaleLowerCase().trim();

  return normalizedQuery.length
    ? people.filter(person =>
        person.name.toLocaleLowerCase().includes(normalizedQuery),
      )
    : [...people];
}
