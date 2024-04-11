import React from 'react';
import { Person } from '../types/Person';

interface Props {
  suggestions: Person[];
  setSelectedPerson: (person: Person) => void;
}

export const Dropdowns: React.FC<Props> = React.memo(
  ({ suggestions, setSelectedPerson }) => {
    return (
      <div className="dropdown-content">
        {suggestions.map(person => (
          <div
            key={person.slug}
            className="dropdown-item"
            data-cy="suggestion-item"
            onClickCapture={() => setSelectedPerson(person)}
          >
            <p className="has-text-link">{person.name}</p>
          </div>
        ))}
      </div>
    );
  },
);
