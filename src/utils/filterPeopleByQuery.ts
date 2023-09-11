import { Person } from '../types/Person';

export function filterPeopleByQuery(people: Person[], query: string) {
  const normalizedQuery = query.toLowerCase();

  return people.filter((person) => {
    const normalizedName = person.name.toLowerCase();

    return normalizedName.includes(normalizedQuery);
  });
}
