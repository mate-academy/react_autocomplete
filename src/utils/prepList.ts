import { Person } from '../types/Person';

export function preparePersonList(arr: Person[], que: string): Person[] {
  return arr.filter(
    person => person.name.toLowerCase()
      .includes(que.toLowerCase().trim()),
  );
}
