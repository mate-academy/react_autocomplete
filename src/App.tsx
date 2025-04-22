import React, { useCallback, useMemo, useState } from 'react';
// import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

// function debounce(callback: Function, delay: number) {
//   let timerId = 0;

//   return (...args: any) => {
//     window.clearTimeout(timerId);

//     timerId = window.setTimeout(() => {
//       callback(...args);
//     }, delay);
//   };
// }

export const App: React.FC = () => {
  const initialPeople: Person[] = peopleFromServer.map(person => ({
    ...person,
  }));

  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce((value: string) => {
    setAppliedQuery(value);
  }, 300), []
);

  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);
  const [containerActive, setContainerActive] = useState(false);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setCurrentPerson(null);
  };

  const filteredPeople = useMemo(() => {
    const normalizedQuery = appliedQuery.trim().toLowerCase();

    if (normalizedQuery === '') {
      return peopleFromServer;
    }

    return peopleFromServer.filter(initperson =>
      initperson.name.toLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {`${currentPerson ? `${currentPerson?.name} (${currentPerson?.born} - ${currentPerson?.died})` : 'No selected person'}`}
        </h1>

        <div className={`dropdown ${containerActive ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              value={query}
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onFocus={() => setContainerActive(true)}
              onBlur={() => setContainerActive(false)}
              onChange={handleQueryChange}
            />
          </div>
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {(query.trim() ? filteredPeople : initialPeople).map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onMouseDown={() => {
                    setCurrentPerson(person);
                    setContainerActive(false);
                  }}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {filteredPeople.length === 0 && query.trim() && (
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
