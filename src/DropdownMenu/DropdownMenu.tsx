import React from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onClick: (person: Person) => void;
};

export const DropdownMenu: React.FC<Props> = ({ people, onClick }) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {people.map((person, i) => (
          <div
            className="dropdown-item"
            onMouseDown={() => onClick(person)}
            data-cy="suggestion-item"
            key={i + 1}
          >
            <p className="has-text-link" style={{ cursor: 'pointer' }}>
              {person.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
