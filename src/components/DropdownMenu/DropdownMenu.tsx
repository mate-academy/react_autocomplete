import { memo } from 'react';
import { Person } from '../../types/Person';
import { DropdownItem } from '../DropdownItem/DropdownItem';
import './DropdownMenu.scss';

interface Props {
  suggestions: Person[];
  onSelect: (person: Person) => void;
}

const Menu: React.FC<Props> = ({ suggestions, onSelect }) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {suggestions.length ? (
          suggestions.map((person) => (
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
