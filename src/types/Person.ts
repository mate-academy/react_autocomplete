import { peopleFromServer } from '../data/people';

export interface Person {
  name: string;
  sex: 'm' | 'f';
  born: number;
  died: number;
  fatherName: string | null;
  motherName: string | null;
  slug: string;
}

export function getPersonByName(name: string) {
  return peopleFromServer.find(person =>
    person.name.toLowerCase().includes(name.toLowerCase()),
  );
}
