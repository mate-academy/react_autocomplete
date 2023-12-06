import { Person } from './types/Person';

export const selectedPeopleBySlug = (people: Person[], slug: string) => {
  return people.find(person => person.slug === slug);
};
