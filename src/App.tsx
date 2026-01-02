import React, { useState, useCallback, useRef } from 'react';
import debounce from 'lodash/debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import type { Person } from './types/Person';
import type { Props } from './types/Props';

export const App: React.FC<Props> = ({ onSelected, delay = 300 }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPeople, setFilteredPeople] = useState(peopleFromServer);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const lastSearchedQueryRef = useRef('');

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query === lastSearchedQueryRef.current) {
        return;
      }

      setSearchQuery(query);
      lastSearchedQueryRef.current = query;

      if (query.trim() === '') {
        setFilteredPeople(peopleFromServer);
      } else {
        const filtered = peopleFromServer.filter(person =>
          person.name.toLowerCase().includes(query.toLowerCase()),
        );

        setFilteredPeople(filtered);
      }
    }, delay),
    [delay],
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value;

      setInputValue(query);
      setSelectedPerson(null);
      debouncedSearch(query);
    },
    [debouncedSearch],
  );

  const handleSelectPerson = useCallback(
    (person: Person) => {
      setSelectedPerson(person);
      setInputValue(person.name);

      onSelected?.(person);
    },
    [onSelected],
  );

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={`dropdown ${isFocused ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 1000)}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onMouseDown={() => handleSelectPerson(person)}
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
        </div>

        {filteredPeople.length === 0 && searchQuery.trim() !== '' && (
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
