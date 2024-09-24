import React from 'react';
import { Person } from '../types/Person';

interface Props {
  people: Person[];
  onSelect: (value: string) => void;
  setIsFocused: (value: boolean) => void;
}

export const Dropdown: React.FC<Props> = ({
  people,
  onSelect,
  setIsFocused,
}) => (
  <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
    <div className="dropdown-content">
      {people.map(person => (
        <div
          className="dropdown-item"
          data-cy="suggestion-item"
          key={person.slug}
          onClick={() => {
            onSelect(person.name);
            setIsFocused(false);
          }}
        >
          <p className="has-text-link">{person.name}</p>
        </div>
      ))}
    </div>
  </div>
);
