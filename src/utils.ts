import { FilterPeople } from './types';

export const filterPeople: FilterPeople = (people, { query }) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (query) {
    return people.filter(
      person => person.name.toLowerCase().includes(normalizedQuery),
    );
  }

  return people;
};
