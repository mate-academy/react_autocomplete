import React from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onMouseDown?: (person: Person) => void;
  onSelected?: (person: Person) => void;
};

export const Menu: React.FC<Props> = ({ people, onMouseDown, onSelected }) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {people.map(person => (
          <div
            key={person.slug}
            className="dropdown-item"
            data-cy="suggestion-item"
            onMouseDown={() => {
              onMouseDown?.(person);
              onSelected?.(person);
            }}
          >
            <p className="has-text-link">{person.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
