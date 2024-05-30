import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [onFocus, setOnFocus] = useState(false);
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);
  const [appliedQuery, setAppliedQuery] = useState('');
  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const filteredPeople = useMemo(() => {
    if (appliedQuery) {
      return peopleFromServer.filter(item => item.name.includes(appliedQuery));
    }

    return peopleFromServer;
  }, [appliedQuery]);

  const handleQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    if (!currentPerson) {
      setQuery(event.target.value.trim());
      applyQuery(event.target.value.trim());
    }

    setCurrentPerson(null);
  };

  const hadleSelectedChange = (person: Person) => {
    setQuery(person.name);
    applyQuery(person.name);
    setCurrentPerson(person);
    setOnFocus(false);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {currentPerson ? (
          <h1 className="title" data-cy="title">
            {`${currentPerson.name} (${currentPerson.born} - ${currentPerson.died})`}
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        )}

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onFocus={() => setOnFocus(true)}
              onChange={handleQueryChange}
            />
          </div>

          {onFocus && filteredPeople.length > 0 && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeople.map(person => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.name}
                  >
                    <a
                      className="has-text-link"
                      onClick={() => hadleSelectedChange(person)}
                    >
                      {person.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {filteredPeople.length <= 0 && (
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
