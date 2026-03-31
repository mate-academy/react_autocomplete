import React from 'react';
import './App.scss';
import { Person } from './types/Person';

interface Props {
  people: Person[];
  onSelect: (person: Person) => void;
  isFocused: boolean;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelect,
  isFocused,
}) => {
  return (
    <>
      {!people.length && isFocused && (
        <div className="dropdown-item" data-cy="no-suggestions-message">
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}

      {people.map(person => (
        <div
          className="dropdown-item"
          data-cy="suggestion-item"
          key={person.slug}
          onMouseDown={() => onSelect(person)}
        >
          <p
            className={person.sex === 'm' ? 'has-text-link' : 'has-text-danger'}
          >
            {person.name}
          </p>
        </div>
      ))}
    </>
  );
};
