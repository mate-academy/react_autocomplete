import React, { useEffect, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const debouncedFilter = useMemo(
    () =>
      debounce((value: string) => {
        const trimmed = value.trim();

        if (!trimmed) {
          setSuggestions(peopleFromServer);

          return;
        }

        const filtered = peopleFromServer.filter(person =>
          person.name.toLowerCase().includes(trimmed.toLowerCase()),
        );

        setSuggestions(filtered);
      }, 300),
    [],
  );

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions(peopleFromServer);

      return;
    }

    debouncedFilter(query);

    return () => {
      debouncedFilter.cancel();
    };
  }, [query, debouncedFilter]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setSelectedPerson(null);
    setQuery(newValue);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);

    if (!query.trim()) {
      setSuggestions(peopleFromServer);
    }
  };

  const handleInputBlur = () => {
    setIsOpen(false);
  };

  const handleSuggestionClick = (person: Person) => {
    setQuery(person.name);
    setSelectedPerson(person);
    setIsOpen(false);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={classNames('dropdown', { 'is-active': isOpen })}>
          <div className="dropdown-trigger">
            <input
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

          {isOpen && suggestions.length > 0 && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {suggestions.map(person => (
                  <div
                    key={person.slug}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onMouseDown={() => handleSuggestionClick(person)}
                  >
                    <p
                      className={
                        person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                      }
                    >
                      {person.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {isOpen && query && suggestions.length === 0 && (
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
