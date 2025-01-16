import React, { useMemo, useState } from 'react';
import './App.scss';
import cn from 'classnames';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';

type AppProps = {
  debounceDelay?: number;
};
export const App: React.FC<AppProps> = ({ debounceDelay = 300 }) => {
  const [query, setQuery] = useState('');
  const [onFocus, setOnFocus] = useState(false);
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);
  const [appliedQuery, setAppliedQuery] = useState('');

  const title = currentPerson
    ? `${currentPerson.name} (${currentPerson.born} - ${currentPerson.died})`
    : 'No selected person';

  const applyQuery = debounce(setAppliedQuery, debounceDelay);

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person => {
      const caseQuery = appliedQuery.toLocaleLowerCase().trim();
      const caseName = person.name.toLocaleLowerCase().trim();

      return caseName.includes(caseQuery);
    });
  }, [appliedQuery]);

  const handleQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setQuery(event.target.value.trim());
    applyQuery(event.target.value.trim());
    setCurrentPerson(null);
  };

  const hadleSelectedChange = (person: Person) => {
    setQuery(person.name);
    applyQuery(person.name);
    setCurrentPerson(person);
    setOnFocus(false);
  };

  enum Sex {
    male = 'm',
    female = 'f',
  }

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {title}
        </h1>

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
          {onFocus && !!filteredPeople.length && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeople.map(person => {
                  const { sex } = person;

                  return (
                    <div
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      key={person.name}
                      onClick={() => hadleSelectedChange(person)}
                    >
                      <p
                        className={cn({
                          'has-text-link': sex === Sex.male,
                          'has-text-danger': sex === Sex.female,
                        })}
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
        {!filteredPeople.length && (
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
