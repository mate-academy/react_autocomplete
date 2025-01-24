// eslint-disable-next-line max-len, prettier/prettier
import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [people] = useState<Person[]>(peopleFromServer);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [isShown, setIsShown] = useState(true);
  const [isFocused, setIsFocused] = useState(true);
  const [appliedQuery, setAppliedQuery] = useState('');

  const searchFielt = useRef<HTMLInputElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchFielt.current) {
      searchFielt.current.focus();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdown.current &&
        !dropdown.current.contains(event.target as Node) &&
        searchFielt.current &&
        !searchFielt.current.contains(event.target as Node)
      ) {
        setIsShown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputClick = () => {
    if (isFocused) {
      searchFielt.current?.blur();
      setIsShown(false);
    } else {
      searchFielt.current?.focus();
      setIsShown(true);
    }

    setIsFocused(!isFocused);
  };

  const inputBlure = () => {
    setIsFocused(false);
  };

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPerson(null);
    setIsShown(true);
    setQuery(e.target.value);
    applyQuery(e.target.value);
  };

  const filteredPerson = useMemo(() => {
    const filtered = people.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLocaleLowerCase()),
    );

    if (!filtered.length) {
      setIsShown(false);
    }

    return filtered;
  }, [appliedQuery, people]);

  const isDangerShown = !filteredPerson.length && !isShown;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div
          className={classNames('dropdown', {
            'is-active': isShown,
          })}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
              ref={searchFielt}
              onClick={handleInputClick}
              onBlur={inputBlure}
            />
          </div>

          <div
            className="dropdown-menu"
            role="menu"
            data-cy="suggestions-list"
            ref={dropdown}
          >
            <div className="dropdown-content">
              {filteredPerson.map((person, index) => (
                <div
                  key={index}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => setSelectedPerson(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {isDangerShown && (
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
      </main>
    </div>
  );
};
