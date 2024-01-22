import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';

export function getPreparedPeople(): Person[] {
  return peopleFromServer.map(person => ({
    ...person,
  }));
}
