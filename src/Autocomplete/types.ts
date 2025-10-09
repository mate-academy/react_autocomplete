import { Person } from '../types/Person';

export type AutocompleteProps = {
  people: Person[];
  selectedPerson: Person | null;
  onSelected: (person: Person | null) => void;
  delayMs?: number;
  placeholder?: string;
};
