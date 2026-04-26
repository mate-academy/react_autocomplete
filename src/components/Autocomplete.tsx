import React from 'react';
import { Person } from '../types/Person';
import './Autocomplete.scss';

type Props = {
  people: Person[];
  onNewSelected: (person: Person) => void;
  setNewValue: (name: string) => void;
};

function randomId() {
  const id: number = +String(Math.random()).slice(2);

  return id;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  onNewSelected,
  setNewValue,
}) => {
  if (people.length > 0) {
    return (
      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {people.map(person => {
            return (
              <div
                key={randomId()}
                className="dropdown-item"
                data-cy="suggestion-item"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  onNewSelected(person);
                  setNewValue(person.name);
                }}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return;
};
