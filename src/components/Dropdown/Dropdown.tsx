import React from 'react';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  onSelected: (person: Person) => void;
};

export const Dropdown: React.FC<Props> = ({ people, onSelected }) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {people.map((person: Person) => (
          <button
            type="button"
            className="dropdown-item button is-white"
            data-cy="suggestion-item"
            key={person.slug}
            onMouseDown={() => onSelected(person)}
          >
            <p className="has-text-link">{person.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
