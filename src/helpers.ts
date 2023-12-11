import { Person } from './types/Person';

export const filterPeople = (people: Person[], query: string) => {
  if (!query.length) {
    return people;
  }

  const loweredQuery = query.toLowerCase();

  return people.filter(person => {
    const loweredPersonName = person.name.toLowerCase();

    return loweredPersonName.includes(loweredQuery);
  });
};
