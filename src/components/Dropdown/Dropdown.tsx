import React from 'react';
import { Person } from '../../types/Person';
//eslint-disable-next-line
import classNames from 'classnames';

type Props = {
  query: string;
  filteredPerson: Person[];
  delay?: number;
  handleSuggest: (person: Person) => void;
  handleInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isFocused: boolean;
  setFocused: (val: boolean) => void;
};

export const Dropdown: React.FC<Props> = ({
  query,
  filteredPerson,
  handleSuggest,
  isFocused,
  setFocused,
  handleInput,
}) => {
  return (
    <div
      className={classNames('dropdown', {
        'is-active': isFocused,
      })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleInput}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredPerson.length > 0 ? (
            filteredPerson.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.slug}
                onMouseDown={() => handleSuggest(person)}
              >
                <p
                  className={
                    person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                  }
                >
                  {person.name}
                </p>
              </div>
            ))
          ) : (
            <div
              className="notification
                    is-danger is-light
                    mt-3
                    is-align-self-flex-start"
              role="alert"
              data-cy="no-suggestions-message"
            >
              <p className="has-text-danger">No matching suggestions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
