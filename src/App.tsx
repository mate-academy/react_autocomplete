import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setPeople(peopleFromServer);
  }, []);

  const visiblePeople = people.filter((person) => {
    const inputQuery = query.trim().toLocaleLowerCase();
    const name = person.name.toLocaleLowerCase();

    return name.includes(inputQuery);
  });

  return (
    <main className="section">
      <h1 className="title">React Autocomplete</h1>

      <div className={classNames(
        'dropdown',
        { 'is-active': query },
      )}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {visiblePeople.map((person) => (
              <div className="dropdown-item">
                <p
                  className={classNames(
                    { 'has-text-link': person.sex === 'm' },
                    { 'has-text-danger': person.sex === 'f' },
                  )}
                >
                  {person.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};
