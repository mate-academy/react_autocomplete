import { type Person } from './Person';

export type DropdownType = {
  people: Person[];
  onSelected: (person: Person | null) => void;
  person: Person | null;
};
