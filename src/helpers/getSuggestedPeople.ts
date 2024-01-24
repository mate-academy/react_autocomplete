import { Person } from '../types/Person';

export const getSuggestedPeople = (people: Person[], query: string) => {
  if (!query) {
    return [];
  }

  return people
    .filter(person => {
      const prepairedQuery = query.toLowerCase();

      return person.name
        .toLowerCase()
        .includes(prepairedQuery);
    });
};
