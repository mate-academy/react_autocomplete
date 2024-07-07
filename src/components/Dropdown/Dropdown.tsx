import { useCallback, useState } from 'react';
import { Person } from '../../types/Person';
import React from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';

type Props = {
  onSelected: (person: Person) => void;
  delay: number;
  filteredList: Person[];
  setAppliedQuery: (arg: string) => void;
  setSelectedPerson: (person?: Person) => void;
};

export const Dropdown: React.FC<Props> = React.memo(
  ({ onSelected, delay, filteredList, setAppliedQuery, setSelectedPerson }) => {
    const [query, setQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const applyQuery = useCallback(
      (arg: string) => debounce(setAppliedQuery, delay)(arg),
      [setAppliedQuery, delay],
    );

    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedPerson();

      setQuery(event.target.value);
      applyQuery(event.target.value);
    };

    const handleSuggestionClick = (person: Person) => {
      setQuery(person.name);
      setAppliedQuery(person.name);
      onSelected(person);
    };

    const handleShowSuggestions = (a: boolean) => {
      setTimeout(() => {
        setShowSuggestions(a);
      }, 200);
    };

    return (
      <>
        <div className="dropdown is-active is-hoverable">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => handleShowSuggestions(true)}
              onBlur={() => handleShowSuggestions(false)}
            />
          </div>

          {showSuggestions && filteredList.length > 0 && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content max-height-dropdown">
                {filteredList.map((person: Person) => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.slug}
                    onClick={() => handleSuggestionClick(person)}
                  >
                    <p
                      className={classNames(
                        person.sex === 'm'
                          ? 'has-text-link'
                          : 'has-text-danger',
                      )}
                    >
                      {person.name}
                    </p>
                    <hr className="dropdown-divider" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {!filteredList.length && (
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
  },
);
