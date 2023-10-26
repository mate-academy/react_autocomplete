import { Person } from '../types/Person';

export function debounce(callback: (value: string) => void, delay: number) {
  let timerId = 0;

  return (value: string) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(value);
    }, delay);
  };
}

export function getFilteredPeople(people: Person[], query: string) {
  const copyPeople = [...people];

  const preparedQuery = query.trim().toLowerCase();

  return copyPeople.filter(person => person.name
    .toLowerCase().includes(preparedQuery));
}
