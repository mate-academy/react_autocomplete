import { Person } from '../../types/Person';

export interface Props {
  users: Person[];
  onSelect: (value: Person | null) => void;
  debounceDelay?: number;
}
