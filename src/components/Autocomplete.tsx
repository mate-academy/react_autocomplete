import React, { useState, useMemo, useCallback } from 'react';
import { Person } from '../types/Person';
import debounce from 'lodash.debounce';
import { peopleFromServer } from '../data/people';

interface AutocompleteProps {
  onSelected: (person: Person | null) => void;
  debounceDelay?: number;
}

const Autocomplete: React.FC<AutocompleteProps> = React.memo(
  ({ onSelected, debounceDelay = 1300 }) => {
    const [query, setQuery] = useState('');
    const [appliedQuery, setAppliedQuery] = useState('');
    const [showList, setShowList] = useState(false);

    const applyQuery = useCallback(
      debounce(setAppliedQuery, debounceDelay),
      [],
    );

    const filtredPeople = useMemo(() => {
      return peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
      );
    }, [appliedQuery]);

    const handleFocus = () => {
      setShowList(true);
    };

    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onSelected(null);
      setQuery(event.target.value);
      applyQuery(event.target.value);
    };

    const handleBlur = useCallback(
      debounce(() => {
        if (true) {
          setShowList(false);
        }
      }, debounceDelay),
      [],
    );

    return (
      <>
        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          {showList && filtredPeople.length !== 0 && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filtredPeople.map(person => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.slug}
                  >
                    <a
                      href="#"
                      className="has-text-link"
                      onClick={ev => {
                        ev.preventDefault();
                        setQuery(person.name);
                        onSelected(person);
                      }}
                    >
                      {person.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {filtredPeople.length === 0 && (
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

export default Autocomplete;
