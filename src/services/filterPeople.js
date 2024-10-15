import { peopleFromServer } from '../data/people';

export function filterPeople(normalizedQuery) {
  return peopleFromServer.filter(person =>
    person.name.toLowerCase().includes(normalizedQuery),
  );
}
