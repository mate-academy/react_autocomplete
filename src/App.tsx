import React, { useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { setTimeout } from 'timers';
import './App.scss';

import cn from 'classnames';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectPerson, setSelectPerson] = useState<Person | null>(null);
  const [isInputFocus, setIsInputFocus] = useState(false);

  const { name, born, died } = selectPerson || {};

  const selectedPersonInfo = selectPerson
    ? `${name} (${born} - ${died})`
    : 'No selected person';

  const handlePesonClick = (person: Person, namePerson: string) => {
    setSelectPerson(person);
    setQuery(namePerson);
    setIsInputFocus(false);
  };

  const applyQuery = useMemo(
    () => debounce((value: string) => {
      setAppliedQuery(value);
      setIsInputFocus(true);
    }, 1000),
    [],
  );

  const queryInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setSelectPerson(null);
    setIsInputFocus(false);
  };

  const handleInputFocus = () => {
    setIsInputFocus(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => setIsInputFocus(false), 100);
  };

  const currentPerson = useMemo(() => {
    return peopleFromServer
      .filter(people => people.name.toLowerCase()
        .includes(appliedQuery.toLowerCase()));
  }, [appliedQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPersonInfo}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={queryInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          <div
            className="dropdown-menu"
            role="menu"
            data-cy="suggestions-list"
          >
            {!selectPerson && isInputFocus && (
              <div className="dropdown-content">
                {currentPerson.map(person => {
                  const { name: namePerson, sex, slug } = person;

                  return (
                    <button
                      type="button"
                      className="dropdown-item button is-white"
                      data-cy="suggestion-item"
                      key={slug}
                      onClick={() => handlePesonClick(person, namePerson)}
                    >
                      <p
                        className={cn(
                          'has-text-link',
                          { 'has-text-danger': sex === 'f' },
                        )}
                      >
                        {namePerson}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {!currentPerson.length && (
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
