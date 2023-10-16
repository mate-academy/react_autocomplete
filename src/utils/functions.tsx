import { Person } from '../types/Person';

export const search = (people: Person[], query: string) => {
  const preparedQuery = query.trim().toLowerCase();

  return people
    .filter(person => person.name.toLowerCase().includes(preparedQuery));
};
