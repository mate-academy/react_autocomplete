import React from 'react';
import classNames from 'classnames';

import { Person } from '../../types/Person';

interface Props {
  people: Person[];
  query: string;
  appliedQuery: string;
  onQueryChange: (newQuery: string) => void;
  onPersonClick: (newPerson: Person) => void;
  focusedInput: boolean;
  onInputFocus: (newFocus: boolean) => void;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  query,
  appliedQuery,
  onQueryChange,
  onPersonClick,
  focusedInput,
  onInputFocus,
}) => (
  <div
    className={classNames('dropdown', {
      'is-active': focusedInput,
    })}
  >
    <div className="dropdown-trigger">
      <input
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        data-cy="search-input"
        value={query}
        onChange={event => onQueryChange(event.target.value)}
        onFocus={() => onInputFocus(true)}
      />
    </div>

    {people.length !== 0 && appliedQuery === query && (
      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {people.map(person => (
            <div
              key={person.slug}
              onClick={() => onPersonClick(person)}
              className="dropdown-item"
              data-cy="suggestion-item"
            >
              <p
                className={classNames('has-text-link', {
                  'has-text-danger': person.sex === 'f',
                })}
              >
                {person.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);
