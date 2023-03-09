import cn from 'classnames';
import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const { name, born, died } = selectedPerson || {};

  const visiblePeople = peopleFromServer.filter(person => {
    const lowerName = person.name.toLowerCase();

    return lowerName.includes(query.trim().toLowerCase());
  });

  const shouldShowDropdown = query.trim().length > 0
  && visiblePeople.length > 0;

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${name} (${born} = ${died})`
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        {shouldShowDropdown && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              { visiblePeople.map((person, index) => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedPerson(person);
                    setQuery(person.name);
                  }}
                  onKeyDown={() => {}}
                  role="link"
                  tabIndex={index}
                >
                  <p
                    className={cn({
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
    </main>
  );
};
