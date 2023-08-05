import { Person } from './Person';

export type FilterPeople = (
  people: Person[],
  { query }: { query: string },
) => Person[];
