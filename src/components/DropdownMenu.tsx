import React from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelected: (person: Person) => void;
};

export const DropdownMenu: React.FC<Props> = React.memo(
  ({ people, onSelected }) => {
    return (
      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {people.map(person => (
            <div
              key={person.name}
              className="dropdown-item"
              data-cy="suggestion-item"
              role="button"
              tabIndex={0}
              onMouseDown={() => onSelected(person)}
              onKeyDown={event => {
                if (event.key === 'Enter') {
                  onSelected(person);
                }
              }}
            >
              <p className="has-text-link">{person.name}</p>
            </div>
          ))}
        </div>
      </div>
    );
  },
);
