import React, { useState, useEffect, useRef } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';

interface Person {
  name: string;
  born: number;
  died: number;
}

export const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPeople, setFilteredPeople] = useState(peopleFromServer);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [debounceDelay] = useState(300);
  const previousQuery = useRef(searchQuery);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery === previousQuery.current) {
        return;
      }

      if (!searchQuery.trim()) {
        setFilteredPeople(peopleFromServer);
      } else {
        setFilteredPeople(
          peopleFromServer.filter(person =>
            person.name.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        );
      }

      previousQuery.current = searchQuery;
    }, debounceDelay);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, debounceDelay]);

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    setSearchQuery(person.name);
    setShowDropdown(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedPerson(null);
    setShowDropdown(true);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>
        <div className={`dropdown ${showDropdown ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => setShowDropdown(true)}
            />
          </div>
          {showDropdown && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeople.length > 0 ? (
                  filteredPeople.map(person => (
                    <div
                      key={person.name}
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      onClick={() => handleSelectPerson(person)}
                    >
                      <p className="has-text-link">{person.name}</p>
                    </div>
                  ))
                ) : (
                  <div
                    className="dropdown-item"
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
