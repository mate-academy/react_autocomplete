import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export function debounce(
  callback: React.Dispatch<React.SetStateAction<string>>,
  delay: number,
) {
  let timerId = 0;

  return (query: string) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(query);
    }, delay);
  };
}

export const filterPeople = (appliedQuery: string): Person[] => {
  return peopleFromServer.filter(person => {
    const normalizedName = person.name.toLowerCase();
    const normalizedQuery = appliedQuery.toLowerCase();

    return normalizedName.includes(normalizedQuery);
  });
};
