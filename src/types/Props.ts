import type { Person } from './Person';
export interface Props {
  onSelected?: (person: Person) => void;
  delay?: number;
}
