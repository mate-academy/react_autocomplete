import React, { useState, useEffect, useMemo } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [isDropdownActive, setDropdownActive] = useState(false);

  const debouncedFilterPeople = useMemo(
    () =>
      debounce((searchQuery: string) => {
        if (searchQuery.trim() === '') {
          setFilteredPeople(peopleFromServer);
        } else {
          const lowercasedQuery = searchQuery.toLowerCase();
          const filtered = peopleFromServer.filter(person =>
            person.name.toLowerCase().includes(lowercasedQuery),
          );

          setFilteredPeople(filtered);
        }
      }, 300),
    [],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;

    setQuery(newQuery);

    if (selectedPerson?.name && newQuery.trim() !== selectedPerson.name) {
      setFilteredPeople(peopleFromServer);
      setSelectedPerson(null);
    } else {
      debouncedFilterPeople(newQuery);
    }
  };

  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setDropdownActive(false);
  };

  useEffect(() => {
    if (query.trim() === '') {
      setFilteredPeople(peopleFromServer);
    } else {
      debouncedFilterPeople(query);
    }
  }, [query, debouncedFilterPeople]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={`dropdown ${isDropdownActive ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              value={query}
              onChange={handleInputChange}
              onFocus={() => setDropdownActive(true)}
              onBlur={() => setTimeout(() => setDropdownActive(false), 200)}
              data-cy="search-input"
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.length > 0 ? (
                filteredPeople.map((person, index) => (
                  <div
                    key={index}
                    className="dropdown-item"
                    onClick={() => handlePersonSelect(person)}
                    data-cy="suggestion-item"
                  >
                    <p
                      className={`has-text-link ${person.sex === 'f' ? 'has-text-danger' : ''} is-clickable`}
                    >
                      {person.name}
                    </p>
                  </div>
                ))
              ) : (
                <div className="dropdown-item" data-cy="no-suggestions-message">
                  <p className="has-text-danger">No matching suggestions</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
