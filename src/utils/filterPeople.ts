import { Person } from '../types/Person';

export function filterPeople(
  people: Person[],
  querryForFilter: string,
): Person[] {
  let peopleCopy = [...people];
  const normalizedQuerry = querryForFilter.toLowerCase().trim();

  if (normalizedQuerry) {
    peopleCopy = peopleCopy.filter(
      person => person.name.toLowerCase().includes(normalizedQuerry),
    );
  }

  return peopleCopy;
}
