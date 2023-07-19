import { Person } from '../../types/Person';
import { DropdownItem } from '../DropdownItem/DropdovnItem';

type Props = {
  people: Person[]
  onSelect: (person: Person) => void;
};

export const DropdownMenu: React.FC<Props> = ({ people, onSelect }) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length
          ? people.map(person => (
            <DropdownItem
              person={person}
              key={person.slug}
              onClick={onSelect}
            />
          ))
          : (
            <div className="dropdown-item">
              <p className="has-text-link">
                No matching suggestions
              </p>
            </div>
          )}
      </div>
    </div>
  );
};
