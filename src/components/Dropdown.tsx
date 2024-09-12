import './Dropdown.scss';
import React, { useCallback, useMemo, useState } from 'react';
import { peopleFromServer } from '../data/people';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

type Props = {
  delay: number;
  onSelect: (person: Person | null) => void;
};

export const Dropdown: React.FC<Props> = ({ delay, onSelect }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  const filteredPeople = useMemo(() => {
    if (!query && isInputFocused) {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person =>
      person.name.toLowerCase().trim().includes(query.toLowerCase().trim()),
    );
  }, [appliedQuery]);

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setIsInputFocused(true);
    onSelect(null);
  };

  const isMenuShown = isInputFocused && filteredPeople.length > 0;

  const handleClick = (person: Person) => {
    onSelect(person);
    setQuery(person.name);
  };

  return (
    <React.Fragment>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleOnChange}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
          />
        </div>

        {isMenuShown && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => {
                return (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.slug}
                    onMouseDown={() => handleClick(person)}
                  >
                    <p
                      className={cn({
                        'has-text-link': person.sex === 'm',
                        'has-text-danger': person.sex === 'f',
                      })}
                    >
                      {person.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {filteredPeople.length === 0 && (
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
    </React.Fragment>
  );
};
