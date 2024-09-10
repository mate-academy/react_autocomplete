import React from 'react';
import { Person } from '../types/Person';

import '../component/Autocomplete.scss';

type Props = {
  people: Person[];
  onSelected: (person: Person) => void;
};

export const Autocomplete: React.FC<Props> = React.memo(
  ({ people, onSelected }) => {
    return (
      <div className="dropdown-content">
        {people.map(person => (
          <div
            key={person.slug}
            className="dropdown-item"
            data-cy="suggestion-item"
            onClick={() => onSelected(person)}
          >
            <p className="has-text-link">{person.name}</p>
          </div>
        ))}
      </div>
    );
  },
);
