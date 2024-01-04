import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';

export function getPeopleByName(name: string): Person[] {
  const lowerCaseName = name.toLowerCase();

  return peopleFromServer.filter(person => person.name
    .toLowerCase()
    .includes(lowerCaseName));
}
