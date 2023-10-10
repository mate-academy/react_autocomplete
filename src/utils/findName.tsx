import { Person } from '../types/Person';

export function findName(
  event: string,
  peopleFromServer: Person[],
  setVisiblePeople: (people: Person[]) => void,
) {
  const filteredPeople = peopleFromServer
    .filter(person => person.name
      .toLowerCase().includes(event.toLowerCase()));

  setTimeout(() => {
    setVisiblePeople(filteredPeople);
  }, 1000);
}
