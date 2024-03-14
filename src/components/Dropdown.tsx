import React from 'react';
import { Person } from '../types/Person';

interface Props {
  people: Person[];
  onSelected: (person: Person) => void;
}

export const Dropdown : React.FC<Props> = ({ people, onSelected }) => {
  return (
    <div
      className="dropdown-menu"
      role="menu"
      data-cy="suggestions-list"
    >
      <div className="dropdown-content">
        {people.map(person => (
          <div
            className="dropdown-item"
            data-cy="suggestion-item"
            role="button"
            tabIndex={0}
            key={person.name}
            onMouseDown={() => {
              onSelected(person);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
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
};
