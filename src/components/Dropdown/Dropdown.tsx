import React from 'react';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  onSelect: (name: string) => void;
};

export const Dropdown: React.FC<Props> = React.memo((({
  people, onSelect,
}) => (
  <div className="dropdown-menu" role="menu">
    <div className="dropdown-content">
      {people.length ? people.map((person: Person) => (
        <a
          href="/"
          className="dropdown-item"
          key={person.name}
          onMouseDown={() => {
            onSelect(person.name);
          }}
        >
          {person.sex === 'm' ? (
            <p className="has-text-link">{person.name}</p>
          ) : (
            <p className="has-text-danger">{person.name}</p>
          )}
        </a>
      )) : (
        <div>
          No matching suggestions
        </div>
      )}
    </div>
  </div>
)));
