import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import classNames from 'classnames';

export const App: React.FC = () => {
  const delay = 300;
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const filterPeople = useCallback((text: string) => {
    const trimmedQuery = text.trim();

    if (!trimmedQuery) {
      setSuggestions(peopleFromServer);

      return;
    }

    const lowercaseQuery = trimmedQuery.toLowerCase();
    const filteredPeople = peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(lowercaseQuery),
    );

    setSuggestions(filteredPeople);
  }, []);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      filterPeople(query);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, delay, filterPeople]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFocus = () => {
    setIsDropdownActive(true);

    if (!query.trim()) {
      setSuggestions(peopleFromServer);
    }
  };

  const handlePersonSelected = useCallback((person: Person | null) => {
    setSelectedPerson(person);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchText = e.target.value;

    setQuery(newSearchText);
    setIsDropdownActive(true);
    handlePersonSelected(null);
  };

  const handleSelectPerson = (person: Person) => {
    setQuery(person.name);
    setIsDropdownActive(false);
    handlePersonSelected(person);
  };

  const hasSuggestions = suggestions.length > 0;

  const titleText = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
    : 'No selected person';

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {titleText}
        </h1>

        <div
          ref={dropdownRef}
          className={classNames('dropdown', { 'is-active': isDropdownActive })}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleInputChange}
              onFocus={handleFocus}
            />
          </div>

          {isDropdownActive && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {hasSuggestions ? (
                  suggestions.map(person => (
                    <div
                      key={person.slug}
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      onClick={() => handleSelectPerson(person)}
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
                  ))
                ) : (
                  <div
                    className="notification is-danger is-light mt-3 mb-0"
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
      </main>
    </div>
  );
};
