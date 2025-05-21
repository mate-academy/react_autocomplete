import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import classNames from 'classnames';
import { Person } from './types/Person';

function debounce(callback: (value: string) => void, delay: number) {
  let timerId = 0;

  return (value: string) => {
    clearTimeout(timerId);
    timerId = window.setTimeout(() => {
      callback(value);
    }, delay);
  };
}

export const App: React.FC = () => {
  const [query, setQuery] = useState('');

  const [isFocused, setIsFocused] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person>();

  const [appliedSearch, setAppliedSearch] = useState('');

  const applySearch = debounce(setAppliedSearch, 300);

  function handleTextChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    applySearch(event.target.value);
    setSelectedPerson(undefined);
  }

  const filteredPeople = useMemo(() => {
  return peopleFromServer
    .filter(fperson =>
      fperson.name.toLocaleLowerCase().includes(appliedSearch.toLocaleLowerCase()),
    );
}, [appliedSearch]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div
          className={classNames(
            'dropdown',
            isFocused === true ? 'is-active' : '',
          )}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={event => handleTextChange(event)}
              onFocus={() => setIsFocused(true)}
              onBlur={query.length === 0 ? () => setIsFocused(false) : () => {}}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            {filteredPeople.length !== 0 && (
              <div className="dropdown-content">
                {filteredPeople.map(person => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.slug}
                    onClick={() => setSelectedPerson(person)}
                  >
                    <p
                      className={classNames(
                        person.sex === 'f'
                          ? 'has-text-danger'
                          : 'has-text-link',
                      )}
                    >
                      {person.name}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {filteredPeople.length === 0 && (
              <div
                className="notification is-danger 
                is-light mt-3 is-align-self-flex-start"
                role="alert"
                data-cy="no-suggestions-message"
              >
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
