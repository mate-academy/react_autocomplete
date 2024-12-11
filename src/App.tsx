import React, {
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
} from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isDropdownActive, setIsDropdownActive] = useState(true);
  const [chosenPerson, setChosenPerson] = useState<Person | null>(null);
  const delay = 300;

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), [
    setAppliedQuery,
    delay,
  ]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);
    applyQuery(value);
    setChosenPerson(null);
    setIsDropdownActive(true);
  };

  const handlePersonClick = (slug: string) => {
    const foundedPerson =
      peopleFromServer.find(person => person.slug === slug) || null;

    setChosenPerson(foundedPerson);
    setIsDropdownActive(false);
  };

  const handleInputClick = () => {
    setIsDropdownActive(true);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  const timeoutRef = useRef<number | null>(null);

  const handleInputBlur = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIsDropdownActive(false);
    }, 100);
  };

  const handleInputFocus = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsDropdownActive(true);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {chosenPerson === null
            ? 'No selected person'
            : `${chosenPerson.name} (${chosenPerson.born} - ${chosenPerson.died})`}
        </h1>

        <p></p>

        <div
          className={classNames('dropdown', { 'is-active': isDropdownActive })}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onChange={handleQueryChange}
              value={query}
              onClick={handleInputClick}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                >
                  <p
                    className={classNames({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                    onClick={() => handlePersonClick(person.slug)}
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {filteredPeople.length === 0 && (
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
