import React, { useEffect, useMemo, useState } from 'react';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import './App.scss';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectPerson, setSelectPerson] = useState<Person | null>(null);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [inputFocused, setInputFocused] = useState(false);

  const debouncedFilter = useMemo(
    () =>
      debounce((value: string) => {
        const filtered = value
          ? peopleFromServer.filter(person => person.name.includes(value))
          : peopleFromServer;

        setFilteredPeople(filtered);
      }, 300),
    [],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    debouncedFilter(event.target.value);
  };

  const handleSelectedPerson = (person: Person) => {
    setQuery(person.name);
    setSelectPerson(person);
    setFilteredPeople([]);
  };

  const handleInputFocus = () => {
    setInputFocused(true);
    if (!query) {
      setFilteredPeople(peopleFromServer);
    }
  };

  useEffect(() => {
    if (selectPerson && selectPerson.name !== query) {
      setSelectPerson(null);
    }
  }, [query, selectPerson]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {selectPerson ? (
          <h1 className="title" data-cy="title">
            {`${selectPerson.name} (${selectPerson.born} - ${selectPerson.died})`}
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        )}

        <div className={`dropdown ${inputFocused ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map((person, index) => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={index}
                  onClick={() => handleSelectedPerson(person)}
                >
                  <p>{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {query && !filteredPeople.length && (
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
