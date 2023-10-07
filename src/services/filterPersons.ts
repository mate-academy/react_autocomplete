import { Person } from '../types/Person';

export function filterPersons(persons: Person[], query: string) {
  return persons
    .filter((person) => person.name.toLowerCase()
      .includes(query.toLowerCase()));
}
