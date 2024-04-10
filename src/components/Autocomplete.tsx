import React, { useState, useMemo, useRef, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [isDropdownActive, setIsDropdownActive] = useState(false);

  const dropdownRef = useRef(null);

  const applyQuery = useCallback(() => {
    setIsDropdownActive(true);
  }, []);

  const debouncedAppplyQuery = debounce(applyQuery, delay);

  const filteredPeople = useMemo(() => {
    return people.filter(person =>
      person.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedAppplyQuery();
    setQuery(event.target.value);
    onSelected(null);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsDropdownActive(false);
    }, 300);
  };

  const handleInputFocus = () => {
    if (!query) {
      setIsDropdownActive(true);
    }
  };

  const handleSuggestionsPersonClick = (person: Person) => {
    setQuery(person.name);
    setIsDropdownActive(false);
    onSelected(person);
  };

  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            ref={dropdownRef}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        </div>

        {isDropdownActive && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.length ? (
                filteredPeople.map(person => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.slug}
                    style={{ cursor: 'pointer' }}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      handleSuggestionsPersonClick(person);
                    }}
                    onKeyDown={event => {
                      if (event.key === 'Enter') {
                        handleSuggestionsPersonClick(person);
                      }
                    }}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))
              ) : (
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
            </div>
          </div>
        )}
      </div>
    </>
  );
};
