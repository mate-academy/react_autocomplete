import React, { useEffect, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

type Props = {
  delay?: number;
  onSelected?: (person: Person) => void;
};

export const App: React.FC<Props> = ({ delay = 300, onSelected }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState(peopleFromServer);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    const normalisedQuery = query.trim().toLowerCase();

    const timer = setTimeout(() => {
      if (!normalisedQuery) {
        setSuggestions(peopleFromServer);

        return;
      }

      const filteredPeople = peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(normalisedQuery),
      );

      setSuggestions(filteredPeople);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [query, delay]);

  const handleSelect = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setIsDropdownVisible(false);

    onSelected?.(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={`dropdown ${isDropdownVisible ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onFocus={() => {
                setIsDropdownVisible(true);

                if (!query.trim()) {
                  setSuggestions(peopleFromServer);
                }
              }}
              onChange={event => {
                setQuery(event.target.value);
                setSelectedPerson(null);
                setIsDropdownVisible(true);
              }}
            />
          </div>

          {isDropdownVisible && suggestions.length > 0 && (
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

          {isDropdownVisible && suggestions.length === 0 && query.trim() && (
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
      </main>
    </div>
  );
};
