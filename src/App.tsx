import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';

type Person = {
  name: string;
  born: number;
  died: number;
};

export const App: React.FC = () => {
  const [people] = useState(peopleFromServer);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [lastAppliedQuery, setLastAppliedQuery] = useState('');
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const delay = 300;
  const timerRef = useRef(0);

  useEffect(() => {
    if (query === lastAppliedQuery) {
      return;
    }

    clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setAppliedQuery(query);
      setLastAppliedQuery(query);
    }, delay);
  }, [query, lastAppliedQuery]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setSelectedPerson(null);
  };

  const filteredPeople = useMemo(() => {
    if (isFocused && appliedQuery.trim() === '') {
      return people;
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery, people, isFocused]);

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setAppliedQuery(person.name);
    setIsFocused(false);
    setSelectedPerson(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`
            : `No selected person`}
        </h1>

        <div className={`dropdown ${isFocused ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={handleChange}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            {filteredPeople.length > 0 && (
              <div className="dropdown-content">
                {filteredPeople.map(person => {
                  return (
                    <div
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      key={person.name}
                      onMouseDown={() => handleSelect(person)}
                    >
                      <p className="has-text-link">{person.name}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {filteredPeople.length === 0 && isFocused && (
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
