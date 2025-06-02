import { Person } from '../types/Person';

type Filters = {
  query: string;
};

export const getFilteredPeople = (people: Person[], { query }: Filters) => {
  if (!query) {
    return people;
  }

  return people.filter(person =>
    person.name.trim().toLowerCase().includes(query.trim().toLowerCase()),
  );
};
