import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import React, { useState } from 'react';
import classNames from 'classnames';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [focusOnInput, setFocusOnInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [currentPerson, setCurrentPerson] = useState<null | Person>(null);
  const [isPersonEmpty, setIsPersonEmpty] = useState(true);

  const changeUser = (person: Person) => {
    setCurrentPerson(person);
    setInputValue(person.name);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {currentPerson
            ? `${currentPerson.name} ${currentPerson.born} - ${currentPerson.died}`
            : 'No selected person'}
        </h1>
        <div className={classNames('dropdown', { 'is-active': focusOnInput })}>
          <div className="dropdown-trigger">
            <input
              type="text"
              value={inputValue}
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onFocus={() => setFocusOnInput(true)}
              onBlur={() => setTimeout(() => setFocusOnInput(false), 100)}
              onChange={event => {
                setInputValue(event.currentTarget.value);
                setCurrentPerson(null);
              }}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              <Autocomplete
                persons={peopleFromServer}
                filterBy={inputValue}
                onChangePerson={changeUser}
                onPersonEmpty={(isPersonInList: boolean) =>
                  setIsPersonEmpty(isPersonInList)
                }
              />
            </div>
          </div>
        </div>
        {!isPersonEmpty && (
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
