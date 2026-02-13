import React from 'react';

import { Person } from './types/Person';

type Props = {
  people: Person[];
  onSelected?: (p: Person | null) => void;
};

export const Autocomplete: React.FC<Props> = ({ people, onSelected }) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      {people.map(person => (
        <div
          key={person.slug}
          className="dropdown-item"
          data-cy="suggestion-item"
          onClick={() => onSelected?.(person)}
          style={{ cursor: 'pointer' }}
        >
          <p className="has-text-link">{person.name}</p>
        </div>
      ))}
    </div>
  );
};
