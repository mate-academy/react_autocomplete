import { Person } from '../types/Person';

export function getPersonInfo(person: Person | null) {
  if (person) {
    return `${person.name} (${person.born} - ${person.died})`;
  }

  return 'No selected person';
}
