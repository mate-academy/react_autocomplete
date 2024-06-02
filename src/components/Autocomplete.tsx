import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Person } from '../types/Person';
import debounce from 'lodash.debounce';
import { peopleFromServer } from '../data/people';

interface AutocompleteProps {
  onSelected: (person: Person | null) => void;
  debounceDelay?: number;
}

const Autocomplete: React.FC<AutocompleteProps> = React.memo(
  ({ onSelected, debounceDelay = 300 }) => {
    const [query, setQuery] = useState('');
    const [appliedQuery, setAppliedQuery] = useState('');
    const [showList, setShowList] = useState(false);
    const inputElement = useRef<HTMLInputElement>(null);

    const applyQuery = useMemo(
      () => debounce(setAppliedQuery, debounceDelay),
      [debounceDelay],
    );

    const filtredPeople = useMemo(() => {
      return peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(appliedQuery.toLowerCase().trim()),
      );
    }, [appliedQuery]);

    const handleFocus = () => {
      setShowList(true);
    };

    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setShowList(true);
      onSelected(null);
      setQuery(event.target.value);
      applyQuery(event.target.value);
    };

    const handleItemClick = useCallback(
      (person: Person) => {
        setQuery(person.name);
        setAppliedQuery(person.name);
        onSelected(person);
        setShowList(false);
        inputElement.current?.blur();
      },
      [onSelected],
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
              ref={inputElement}
            />
          </div>

          {showList && !!filtredPeople.length && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <ul className="dropdown-content">
                {filtredPeople.map(person => (
                  <li
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.slug}
                  >
                    <a
                      href="#"
                      className="has-text-link"
                      onClick={ev => {
                        ev.preventDefault();
                        handleItemClick(person);
                      }}
                    >
                      {person.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {!filtredPeople.length && (
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
