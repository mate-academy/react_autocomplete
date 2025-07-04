import React, { useEffect, useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import classNames from 'classnames';
import debounce from 'lodash.debounce';

type InputPeople = {
  name: string;
  born: number | string;
  died: number | string;
};

type AppProps = {
  delay?: number;
  onSelected?: (person: InputPeople) => void;
};

export const App: React.FC<AppProps> = ({ delay = 300, onSelected }) => {
  const [isActive, setIsActive] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const filteredPeople = peopleFromServer.filter(person =>
    person.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
  );
  const [selectedPerson, setSelectedPerson] = useState<InputPeople | null>(
    null,
  );

  const debouncedSetQuery = useRef(debounce(q => setDebouncedQuery(q), delay));

  useEffect(() => {
    debouncedSetQuery.current(query);
  }, [query]);

  useEffect(() => {
    debouncedSetQuery.current = debounce(q => setDebouncedQuery(q), delay);

    return () => {
      debouncedSetQuery.current.cancel();
    };
  }, [delay]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    setQuery(val);
    setSelectedPerson(null);
    if (val === '') {
      setDebouncedQuery('');
    }
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born || '—'} - ${selectedPerson.died || '—'})`
            : 'No selected person'}
        </h1>

        <div
          className={classNames('dropdown', { 'is-active': isActive })}
          onClick={() => setIsActive(!isActive)}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleInputChange}
              onFocus={() => {
                setIsActive(true);
              }}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.length > 0 ? (
                filteredPeople.map(people => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={people.slug}
                    onClick={() => {
                      setSelectedPerson(people);
                      setIsActive(false);
                      setQuery(people.name);
                      setDebouncedQuery(people.name);
                      onSelected?.(people);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <p className="has-text-link">{people.name}</p>
                  </div>
                ))
              ) : (
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
