import { Person } from '../../types/Person';

export interface Props {
  user: Person;
  onSelected: (Person: Person) => void;
}
