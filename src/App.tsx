import classNames from 'classnames';
import React, { useState } from 'react';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

const getPreparedPeople = (people: Person[], { query }) => {
  let filteredPeople = [...people];

  if (query && typeof query === 'string') {
    filteredPeople = filteredPeople.filter(
      person => person.name.toLowerCase().includes(query.trim().toLowerCase()),
    );
  }

  return filteredPeople;
};

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const visiblePeople = getPreparedPeople(
    peopleFromServer,
    { query },
  );

  const handleSelectPerson = (
    pers: Person,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();
    setSelectedPerson(pers);
    setQuery(pers.name);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`
          : 'No selected person'}
      </h1>

      <div
        className={classNames('dropdown', {
          'is-active': query && (query !== selectedPerson?.name),
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {visiblePeople.length > 0
              ? (visiblePeople.map(vPerson => (
                <a
                  href="#/"
                  className="dropdown-item"
                  key={vPerson.slug}
                  onClick={(event) => handleSelectPerson(vPerson, event)}
                >
                  <p
                    className={classNames({
                      'has-text-link': vPerson.sex === 'm',
                      'has-text-danger': vPerson.sex === 'f',
                    })}
                  >
                    {vPerson.name}
                  </p>
                </a>
              )))
              : (
                <div className="dropdown-item">
                  <p>
                    No matching suggestions
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    </main>
  );
};
