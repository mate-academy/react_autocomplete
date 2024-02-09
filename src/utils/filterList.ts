import { Person } from '../types/Person';

export function filterPeopleList(list: Person[], query: string) {
  return list.filter(
    (item: Person) => item.name.toLowerCase().includes(query.toLowerCase()),
  );
}
