import { Person } from './types/Person';

export const debounce = (
  f: React.Dispatch<React.SetStateAction<string>>,
  delay:number,
) => {
  let timerId: number;

  return (...args: string[]) => {
    clearInterval(timerId);
    timerId = setTimeout(f, delay, ...args);
  };
};

export const findPersonrBySlug = (people: Person[], personSlug: string) => {
  return people.find(person => person.slug === personSlug) || null;
};
