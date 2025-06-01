import { Person } from '../types/Person';

export const getFilteredPeople = (newQuery: string, people: Person[]) => {
  if (!newQuery) {
    return people;
  }

  const normalisedQuery = newQuery.trim().toLowerCase();

  return people.filter(person => {
    const normalisedName = person.name.trim().toLowerCase();

    return normalisedName.includes(normalisedQuery);
  });
};
