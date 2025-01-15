import React from 'react';
import { Person } from '../types/Person';

type DropdownProps = {
  people: Person[];
  onSelected: (person: Person) => void;
};

export const Dropdown: React.FC<DropdownProps> = ({ people, onSelected }) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {people.map(person => (
          <div
            key={person.slug}
            className="dropdown-item"
            data-cy="suggestion-item"
            onClick={() => onSelected(person)}
          >
            <p
              className={
                person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
              }
            >
              {person.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
