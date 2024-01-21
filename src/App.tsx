import React, { useState, useMemo, MouseEvent } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropItems } from './components/DropItems';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const [query, setQuery] = React.useState('');

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleBlur = () => {
    setTimeout(() => setIsOpen(false), 100);
  };

  const handleReset = () => {
    setSelectedPerson(null);
    setQuery('');
  };

  const handleDropItemClick = (event: MouseEvent, person: Person) => {
    event.preventDefault();

    setSelectedPerson(person);
    setQuery(person.name);
  };

  const sortedPeoples = useMemo(() => {
    return peopleFromServer.filter(person => {
      return person.name.toLowerCase().includes(query.toLowerCase());
    });
  }, [query]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? (
          `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
        ) : ('No one selected')}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger control has-icons-right">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {query && (
            <span className="icon is-small is-right">
              <button
                onClick={handleReset}
                type="button"
                className="delete is-small"
              >
                x
              </button>
            </span>
          )}
        </div>

        {isOpen ? (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {sortedPeoples.length ? (
                sortedPeoples.map(person => (
                  <DropItems
                    person={person}
                    key={person.slug}
                    handleOnClick={handleDropItemClick}
                  />
                ))
              ) : (
                <div className="dropdown-item">
                  <p>No matching suggestions</p>
                </div>
              )}
            </div>
          </div>
        ) : ''}
      </div>
    </main>
  );
};
