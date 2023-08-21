import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';

import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [people] = useState(peopleFromServer);
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);
  };

  const filteredPeople = people.filter(person => (
    person.name.toLowerCase().includes(query.toLowerCase())
  ));

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? (
          `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
        ) : (
          'No selected person'
        )}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onClick={() => {
              setIsDropdownActive(!isDropdownActive);
            }}
          />
        </div>

        <div
          className="dropdown-menu"
          role="menu"
        >
          {isDropdownActive && (
            <div
              className="dropdown-content"
            >
              {filteredPeople.map(person => {
                const isSelectedPerson = selectedPerson?.slug === person.slug;

                return (
                  <div
                    className="dropdown-item"
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setSelectedPerson(person);
                      setIsDropdownActive(false);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        setSelectedPerson(person);
                      }
                    }}
                  >
                    <p
                      className={cn(
                        'has-text-link',
                        {
                          'has-text-danger': isSelectedPerson,
                        },
                      )}
                    >
                      {person.name}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
