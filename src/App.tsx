import React, { useState, useCallback, useMemo } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selected, setSelected] = useState<Person | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const applyQuery = useCallback(
    debounce((nextValue: string) => {
      setQuery(nextValue);
    }, 300),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setAppliedQuery(value);
    applyQuery(value);

    setIsDropdownOpen(true);
    if (selected) setSelected(null);
  };

  const handleSelectPerson = (person: Person) => {
    setSelected(person);
    setAppliedQuery(person.name);
    setQuery(person.name);
    setIsDropdownOpen(false);
  };

  const filteredPeopleList = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return peopleFromServer;
    }
    return peopleFromServer.filter(human =>
      human.name.toLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  return (
    <div className="container">
      <main className="section">
        <h1 className="title" data-cy="title">
          {selected
            ? `${selected.name} (${selected.born} - ${selected.died})`
            : 'No selected person'}
        </h1>

        <div className={`dropdown ${isDropdownOpen ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              className="input"
              value={appliedQuery}
              onChange={handleQueryChange}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Enter a part of the name"
              data-cy="search-input"
            />
          </div>

          {isDropdownOpen && (
            <div className="dropdown-menu" id="dropdown-menu" role="menu">
              <div className="dropdown-content">
                {filteredPeopleList.length > 0 ? (
                  filteredPeopleList.map(person => (
                    <a
                      key={person.name}
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      onClick={() => handleSelectPerson(person)}
                    >
                      {person.name}
                    </a>
                  ))
                ) : (
                  <div className="dropdown-item">
                    <p className="has-text-danger" data-cy="no-suggestions-message">
                      No matching suggestions
                    </p>
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
