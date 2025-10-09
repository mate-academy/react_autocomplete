import { DropTownItem } from '../DropTownItem/DrowTownItem';
import { Person } from '../../types/Person';

interface Props {
  people: Person[];
  onSelect: (person: Person) => void;
}

export const DropTownContent: React.FC<Props> = ({ people, onSelect }) => {
  return (
    <div className="dropdown-content">
      {people.map(person => (
        <DropTownItem
          key={person.slug}
          person={person}
          onSelect={onSelect}
        ></DropTownItem>
      ))}
    </div>
  );
};
