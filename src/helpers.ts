import { Person } from './types/Person';

export const searchedPeople = (peopleData: Person[], searchQuery: string) => {
  const lowerQuery = searchQuery.trim().toLocaleLowerCase();

  return peopleData.filter(people => people.name
    .toLowerCase()
    .includes(lowerQuery));
};
