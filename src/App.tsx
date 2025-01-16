import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';
import cn from 'classnames';

type AppProps = {
  debounceDelay?: number;
  onSelected?: (person: Person | null) => void;
};

export const App: React.FC<AppProps> = ({
  debounceDelay = 300,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [onFocus, setOnFocus] = useState(false);
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);
  const [appliedQuery, setAppliedQuery] = useState('');

  const title = currentPerson
    ? `${currentPerson.name} (${currentPerson.born} - ${currentPerson.died})`
    : 'No selected person';

  const applyQuery = useMemo(
    () => debounce(setAppliedQuery, debounceDelay),
    [setAppliedQuery, debounceDelay],
  );

  const filteredPeople = useMemo(() => {
    const caseQuery = appliedQuery.toLocaleLowerCase().trim();

    if (!caseQuery) {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person => {
      const caseName = person.name.toLocaleLowerCase().trim();

      return caseName.includes(caseQuery);
    });
  }, [appliedQuery]);

  const handleQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const newValue = event.target.value.trim();

    if (newValue === query) {
      return;
    }

    setQuery(newValue);
    applyQuery(newValue);
    setCurrentPerson(null);
  };

  const handleSelectedChange = (person: Person) => {
    setQuery(person.name);
    applyQuery.cancel();
    setTimeout(() => applyQuery(person.name), 0);
    setCurrentPerson(person);
    setOnFocus(false);

    if (onSelected) {
      onSelected(person);
    }
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
                  const { sex, slug } = person;

                  return (
                    <div
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      key={slug}
                      onClick={() => handleSelectedChange(person)}
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
