import React from 'react';
import { Person } from './types/Person';

export const Autocomplete: React.FC<{
  people: Person[];
  onSelect: (person: Person | null) => void;
  focus: boolean;
  match: boolean;
}> = ({ people, onSelect, focus, match }) => {
  return (
    <>
      {focus && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {people.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.slug}
              >
                <p
                  className="has-text-link"
                  onMouseDown={() => onSelect(person)}
                >
                  {person.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {!match && (
        <div
          className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
};
