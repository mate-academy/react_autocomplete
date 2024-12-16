import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { PeopleList } from './components/PeopleList';
import { Person } from './types/Person';
import classNames from 'classnames';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const applyQuery = useCallback(debounce(setAppliedQuery, DEBOUNCE_DELAY), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setSelectedPerson(null);
  };

  const filteredPeople = useMemo(
    () =>
      peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
      ),
    [appliedQuery],
  );

  const handleClickOnPerson = (person: Person) => {
    setSelectedPerson(person);
  };

  const handleInputFocus = () => setIsInputFocused(true);

  const handleInputBlur = () => setIsInputFocused(false);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div
          className={classNames('dropdown', {
            'is-active': isInputFocused,
          })}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          <PeopleList
            people={filteredPeople}
            onSelected={handleClickOnPerson}
          />
        </div>

        {filteredPeople.length === 0 && query && (
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
