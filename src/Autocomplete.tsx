import classNames from 'classnames';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';
import React, { useCallback, useRef, useState } from 'react';
import debounce from 'lodash.debounce';

type Props = {
  setEnteredPerson: (person: Person | null) => void;
  visiblePeople: Person[];
  setVisiblePeople: (array: Person[]) => void;
  delay?: number;
};

export const Autocomplete: React.FC<Props> = ({
  setEnteredPerson,
  setVisiblePeople,
  visiblePeople,
  delay,
}) => {
  const [inputIsTouched, setInputIsTouched] = useState(false);
  const [query, setQuery] = useState('');
  const prevQuery = useRef('');

  const handleSearch = useCallback(
    debounce((searchQuery: string) => {
      if (searchQuery.trim() === '') {
        setVisiblePeople(peopleFromServer);
      } else {
        const filtered: Person[] = peopleFromServer.filter(person =>
          person.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );

        setVisiblePeople(filtered);
      }
    }, delay),
    [delay],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const newQuery: string = event.target.value;

    if (newQuery === prevQuery.current) {
      return;
    }

    setInputIsTouched(true);
    setQuery(newQuery);
    prevQuery.current = newQuery;
    handleSearch(newQuery);
  };

  return (
    <div className={classNames('dropdown', { 'is-active': inputIsTouched })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleQueryChange}
          onClick={() => {
            setInputIsTouched(true);
            if (query.trim() === '') {
              setVisiblePeople(peopleFromServer);
            }
          }}
          onBlur={() => setInputIsTouched(false)}
          onFocus={() => {
            setInputIsTouched(true);

            if (query.trim() === '') {
              setVisiblePeople(peopleFromServer);
            }
          }}
        />
      </div>
      {visiblePeople.length !== 0 && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div
            className={classNames({
              'dropdown-content': true,
              'is-hidden': !inputIsTouched,
            })}
          >
            {visiblePeople.map((person: Person) => (
              <div
                key={person.name}
                className="dropdown-item"
                data-cy="suggestion-item"
                onMouseDown={() => {
                  setEnteredPerson(person);
                  setInputIsTouched(false);
                  setQuery(person.name);
                }}
              >
                <p
                  className={classNames({
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  })}
                >
                  {person.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
