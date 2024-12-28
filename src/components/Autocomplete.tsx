import React from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  isFocused: boolean;
  onSelect: (person: Person) => void;
};

export const Autocomplete: React.FC<Props> = React.memo(
  ({ people, isFocused, onSelect = () => {} }) => {
    if (!isFocused || people.length === 0) {
      return null;
    }

    return (
      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {people.map(p => (
            <div
              className="dropdown-item"
              data-cy="suggestion-item"
              key={p.name}
              onClick={() => {
                onSelect(p);
              }}
            >
              <p className="has-text-link">{p.name}</p>
            </div>
          ))}
        </div>
      </div>
    );
  },
);
