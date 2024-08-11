import { Person } from '../types/Person';

export function getVisiblePeople(people: Person[], query: string): Person[] {
  if (!query) {
    return people;
  }

  return people.filter(person =>
    person.name.toLowerCase().includes(query.toLowerCase()),
  );
}
