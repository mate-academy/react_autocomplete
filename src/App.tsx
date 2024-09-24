import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import classNames from 'classnames';
import { Dropdown } from './components/Dropdown';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [value, setValue] = useState('');
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedPerson] = peopleFromServer.filter(p => p.name === value);

  const title = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
    : 'No selected person';

  const appliedQuery = useCallback(debounce(setQuery, 300), []);

  const inputHandler: React.ChangeEventHandler<HTMLInputElement> = event => {
    setValue(event.target.value);
    appliedQuery(event.target.value);
  };

  const filteredPeople = useMemo(
    () =>
      [...peopleFromServer].filter(person =>
        person.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {title}
        </h1>

        <div className={classNames('dropdown', { 'is-active': isFocused })}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={value}
              onChange={inputHandler}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>

          {!!filteredPeople.length && (
            <Dropdown
              people={filteredPeople}
              onSelect={setValue}
              setIsFocused={setIsFocused}
            />
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
