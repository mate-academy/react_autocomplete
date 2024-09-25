import React from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelect: (person: Person) => void;
};

export const DropdownMenu: React.FC<Props> = React.memo(
  ({ people, onSelect }) => {
    return (
      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {people.map(person => (
            <div
              className="dropdown-item"
              data-cy="suggestion-item"
              key={person.slug}
              onMouseDown={() => onSelect(person)}
            >
              <p className="has-text-link">{person.name}</p>
            </div>
          ))}
        </div>
      </div>
    );
  },
);

DropdownMenu.displayName = 'DropdownMenu';
