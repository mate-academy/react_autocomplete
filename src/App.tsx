import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import cn from 'classnames';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const delay = 300;

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setSelectedPerson(null);
  }

  const handlePersonChange = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    applyQuery(person.name);
    setIsInputFocused(false);
  }

  const filteredPeople = useMemo(() => {
    if (selectedPerson) {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person => person.name.includes(appliedQuery));
  }, [appliedQuery, selectedPerson]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'
          }
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => setIsInputFocused(true)}
              // onBlur={() => { setIsInputFocused(false) }}
            />
          </div>

          {isInputFocused &&
            <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
              <div className="dropdown-content">
                {filteredPeople.map(person => {
                  return (
                    <div className="dropdown-item" data-cy="suggestion-item" key={person.name}>
                      <p className={cn(person.sex === 'f'
                        ? "has-text-danger"
                        : "has-text-link")}
                        onClick={() => handlePersonChange(person)}
                      >
                        {person.name}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          }

        </div>

        {(filteredPeople.length === 0 && appliedQuery) &&
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
          </div>}
      </main>
    </div>
  );
};
