import { Person } from './Person';

export interface AutocompleteProps {
  delay?: number;
  onSelect: (person: Person) => void;
  people: Person[];
  onInputChange?: (value: string) => void;
}
