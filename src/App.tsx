import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './Autocomplete/Autocomplete';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

const filteredPeople = (people: Person[], query: string) => {
  return people.filter(person =>
    person.name.trim().toLowerCase().includes(query.toLowerCase()),
  );
};

const DEBOUNCE_TIME = 300;

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const visiblePeople = useMemo(
    () => filteredPeople(peopleFromServer, appliedQuery),
    [appliedQuery],
  );

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
  };

  const applyQuery = useCallback(
    debounce((value: string) => {
      setAppliedQuery(value);
      setShowOptions(true);
    }, DEBOUNCE_TIME),
    [],
  );

  const handleQueryOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    applyQuery(e.target.value);
    setShowOptions(false);
    setSelectedPerson(null);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowOptions(false);
    }, DEBOUNCE_TIME);
  };

  return (
    <>
      <div className="container">
        <main className="section is-flex is-flex-direction-column">
          {selectedPerson ? (
            <h1 className="title" data-cy="title">
              {`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
            </h1>
          ) : (
            <h1 className="title" data-cy="title">
              No selected person
            </h1>
          )}

          <div
            className={classNames('dropdown', {
              'is-active': showOptions,
            })}
          >
            <div className="dropdown-trigger">
              <input
                value={query}
                type="text"
                placeholder="Enter a part of the name"
                className="input"
                data-cy="search-input"
                onChange={handleQueryOnChange}
                onBlur={handleInputBlur}
                onFocus={() => {
                  setShowOptions(true);
                }}
              />
            </div>
            {visiblePeople.length !== 0 && (
              <Autocomplete
                people={visiblePeople}
                onSelected={handleSelectPerson}
              />
            )}
          </div>

          {visiblePeople.length === 0 && query && (
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
    </>
  );
};
