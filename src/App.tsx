import React, { useState, useEffect } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<
    null | (typeof peopleFromServer)[0]
  >(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    if (query !== selectedPerson?.name) {
      setSelectedPerson(null);
    }
  }, [query, selectedPerson]);

  const filteredPeople = query.trim()
    ? peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(query.toLowerCase()),
      )
    : peopleFromServer;

  const handleSelect = (person: (typeof peopleFromServer)[0]) => {
    setQuery(person.name);
    setSelectedPerson(person);
    setIsDropdownVisible(false);
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
              onChange={e => {
                setQuery(e.target.value);
                setIsDropdownVisible(true);
              }}
              onFocus={() => setIsDropdownVisible(true)}
              onBlur={() => setTimeout(() => setIsDropdownVisible(false), 200)}
            />
          </div>

          {isDropdownVisible && (
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
                      onMouseDown={() => handleSelect(person)}
                    >
                      <p className="has-text-link">{person.name}</p>
                    </div>
                  ))
                ) : (
                  <div
                    className="notification is-danger is-light mt-3 is-align-self-flex-start"
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
