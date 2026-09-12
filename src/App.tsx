import React, { useEffect, useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState(peopleFromServer);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<
  (typeof peopleFromServer)[0] | null
  >(null);

  const lastQuery = useRef('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query === lastQuery.current) {
        return;
      }

      lastQuery.current = query;

      const normalizedQuery = query.toLowerCase().trim();

      if (normalizedQuery === '') {
        setSuggestions(peopleFromServer);
      } else {
        const filteredPeople = peopleFromServer.filter(person =>
          person.name.toLowerCase().includes(normalizedQuery),
        );

        setSuggestions(filteredPeople);
      }

      setIsOpen(true);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setSelectedPerson(null);
    setIsOpen(true);
  };

  const handleFocus = () => {
    if (query === '') {
      setSuggestions(peopleFromServer);
      setIsOpen(true);
    }
  };

  const handleSelect = (person: (typeof peopleFromServer)[0]) => {
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

        <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleChange}
              onFocus={handleFocus}
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
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.slug}
                    onClick={() => handleSelect(person)}
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

          {isOpen && query !== '' && suggestions.length === 0 && (
            <div
              className="notification is-danger is-light mt-3"
              role="alert"
              data-cy="no-suggestions-message"
            >
              <p className="has-text-danger">No matching suggestions</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
