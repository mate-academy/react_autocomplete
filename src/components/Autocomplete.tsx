import classNames from 'classnames';
import React from 'react';
import { Person } from '../types/Person';

type AutocompleteProps = {
  people: Person[];
  onSelected: (person: Person) => void;
};

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  onSelected,
}) => {
  return (
    <div className="dropdown is-active">
      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {people.map(person => (
            <div
              className="dropdown-item"
              data-cy="suggestion-item"
              key={person.slug}
              onClick={() => onSelected(person)}
            >
              <p
                className={classNames({
                  'has-text-link': person.sex === 'm',
                  'has-text-danger': person.sex !== 'm',
                })}
              >
                {person.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
