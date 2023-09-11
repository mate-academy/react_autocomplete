import { memo } from 'react';
import { Person } from '../../types/Person';
import { DropdownItem } from '../DropdownItem/DropdownItem';
import './DropdownMenu.scss';

interface Props {
  people: Person[];
  onSelect: (person: Person) => void;
}

const Menu: React.FC<Props> = ({ people, onSelect }) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length ? (
          people.map((person) => (
            <DropdownItem
              person={person}
              onSelect={onSelect}
              key={person.slug}
            />
          ))
        ) : (
          <p>No matching suggestions</p>
        )}
      </div>
    </div>
  );
};

export const DropdownMenu = memo(Menu);
