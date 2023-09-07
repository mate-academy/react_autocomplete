import React from 'react';

import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelect: (name: string) => void;
};

export const DropDownMenu: React.FC<Props> = React.memo((({
  people, onSelect,
}) => (
  <div className="dropdown-menu" role="menu">
    <div className="dropdown-content">
      {people.length ? people.map((person: Person) => (
        <button
          type="button"
          key={person.name}
          className="dropdown-item"
          onMouseDown={() => {
            onSelect(person.name);
          }}
        >
          {person.sex === 'm' ? (
            <p className="has-text-link">{person.name}</p>)
            : (
              <p className="has-text-danger">{person.name}</p>
            )}
        </button>
      )) : (
        <div className="dropdown-item">
          No matching suggest
        </div>
      )}
    </div>
  </div>
)));
