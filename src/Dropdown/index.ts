import { Person } from '../../types/Person';
export { Dropdown } from './Dropdown';


export interface Props {
  users: Person[];
  onSelect: (value: Person | null) => void;
  debounceDelay?: number;
}
