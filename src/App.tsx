import React, { useEffect, useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import classNames from 'classnames';

type Props = {
  debounceDelay?: number;
  onSelected?: (person: Person) => void;
};

type Person = {
  name: string;
  born: number;
  died: number;
};

export const App: React.FC<Props> = ({ debounceDelay = 300, onSelected }) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [filterpeople, setFilterpeople] = useState(peopleFromServer);
  const [active, setActive] = useState(false);

  const timerId = useRef(0);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const trimmedValue = value.trim();

    setQuery(value);
    setSelectedPerson(null);

    if (timerId.current) {
      window.clearTimeout(timerId.current);
    }

    timerId.current = window.setTimeout(() => {
      if (value === appliedQuery) {
        return;
      }

      setAppliedQuery(trimmedValue);
    }, debounceDelay);
  };

  useEffect(() => {
    if (appliedQuery === '') {
      setFilterpeople(peopleFromServer);

      return;
    }

    const filtered = peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );

    setFilterpeople(filtered);
  }, [appliedQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={classNames('dropdown', { 'is-active': active })}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => setActive(true)}
              onBlur={() => {
                setTimeout(() => setActive(false), 150);
              }}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filterpeople.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.name}
                  onMouseDown={() => {
                    setSelectedPerson(person);
                    setQuery(person.name);
                    setAppliedQuery(person.name);
                    setActive(false);
                    onSelected?.(person);
                  }}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {query.length > 0 && filterpeople.length === 0 && (
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
