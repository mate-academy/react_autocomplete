import React from 'react';
import { Person } from '../types/Person';

interface Props {
  people: Person[],
  onSelected: (username: string) => void,
  isFocused: boolean,
}

export const People: React.FC<Props> = ({ people, onSelected, isFocused }) => (
  <div className="dropdown-menu" role="menu">
    {isFocused && (
      <ul className="dropdown-content">
        {people.length > 0
          ? (people.map(person => (
            <li
              className="dropdown-item"
              key={person.slug}
              onClick={() => onSelected(person.name)}
              aria-hidden="true"
            >
              <p className="has-text-link">{person.name}</p>
            </li>
          ))
          ) : (
            <div>
              No matching suggestions
            </div>
          )}
      </ul>
    )}
  </div>
);
