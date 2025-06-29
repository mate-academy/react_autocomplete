import { Person } from './Person';

export interface AutocompleteProps {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
}
