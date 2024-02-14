import { Person } from '../types/Person';

export const preparePeople = (people: Person[], queryFilter: string) => {
  const normalizedQuery = queryFilter.toLowerCase();

  return people.filter(person => person.name
    .toLowerCase()
    .includes(normalizedQuery));
};
