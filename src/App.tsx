import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import classNames from 'classnames';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [person, setPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isError, setIsError] = useState(false);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        const foundPerson = peopleFromServer.find(human =>
          human.name.toLowerCase().includes(value.toLowerCase()),
        );

        if (!foundPerson) {
          setIsError(true);
          setPerson(null);
        } else {
          setIsError(false);
        }
      }, 300),
    [],
  );

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);
    setIsOpen(true);
    debouncedSearch(value);
  };

  const matchingPeople = peopleFromServer.filter(human =>
    human.name.toLowerCase().includes(query.toLowerCase()),
  );

  const shouldShowDropdown = isOpen && matchingPeople.length > 0;
  const shouldShowError =
    isOpen && matchingPeople.length === 0 && query.trim().length > 0;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {!person || isError || (person && person.name !== query)
            ? 'No selected person'
            : `${person.name} (${person.born} - ${person.died})`}
        </h1>

        <div
          className={classNames('dropdown', {
            'is-active': shouldShowDropdown,
          })}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleNameChange}
              onFocus={() => setIsOpen(true)}
              onBlur={() => setTimeout(() => setIsOpen(false), 200)} // чтобы успел сработать onClick по пункту
            />
          </div>

          {shouldShowDropdown && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {matchingPeople.map(human => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={human.name}
                    onClick={() => {
                      setPerson(human);
                      setQuery(human.name);
                      setIsError(false);
                      setIsOpen(false);
                    }}
                  >
                    <p className="has-text-link">{human.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {shouldShowError && (
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
