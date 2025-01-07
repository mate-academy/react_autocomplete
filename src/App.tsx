import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [chosenPerson, setChosenPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [showList, setShowList] = useState(false);
  const delay = 300;

  const applyQuery = useMemo(() => debounce(setAppliedQuery, delay), [delay]);

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);

    if (chosenPerson && chosenPerson.name !== event.target.value) {
      setChosenPerson(null);
    }
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.includes(appliedQuery),
    );
  }, [appliedQuery]);

  const handleSave = (personName: string) => {
    setQuery(personName);
    setShowList(false);

    const selectedPerson = peopleFromServer.find(
      person => person.name === personName,
    );

    setChosenPerson(selectedPerson || null);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {chosenPerson
            ? `${chosenPerson.name} (${chosenPerson.born} - ${chosenPerson.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQuery}
              onFocus={() => setShowList(true)}
              onBlur={() => setShowList(false)}
            />
          </div>

          {showList && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeople.map(person => {
                  return (
                    <div
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      key={person.name}
                    >
                      <p
                        className="has-text-link"
                        onMouseDown={() => handleSave(person.name)}
                      >
                        {person.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {query && filteredPeople.length === 0 && (
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
