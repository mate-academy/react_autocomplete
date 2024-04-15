import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
// import { Person } from './types/Person';

export const App: React.FC = () => {
  const [pressedInput, setPressedInput] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [chosenPerson, setChosenPerson] = useState<Person | ''>('');

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    setQuery(inputValue);
    applyQuery(inputValue);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {chosenPerson &&
            `${chosenPerson.name} (${chosenPerson.born} -
         ${chosenPerson.died})`}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              autoFocus
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onClick={() => {
                setPressedInput(true);
              }}
              onChange={handleInputChange}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {pressedInput &&
                filteredPeople.map(person => {
                  return (
                    <div
                      style={{ cursor: 'pointer' }}
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      key={person.name}
                      onClick={() => {
                        setChosenPerson(person);
                      }}
                    >
                      <p className="has-text-link-danger">{person.name}</p>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {pressedInput && filteredPeople.length === 0 && (
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
