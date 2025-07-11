import { Person } from '../../types/Person';
import { DropItem } from '../DropItem';

interface Props {
  peoples: Person[];
  onSelected: (person: Person) => void;
}

export const DropContent: React.FC<Props> = ({ peoples, onSelected }) => {
  return (
    <div className="dropdown-content">
      {peoples.map(person => (
        <DropItem key={person.name} person={person} onSelected={onSelected} />
      ))}
    </div>
  );
};
