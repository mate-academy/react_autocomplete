import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const filteredPeople: Person[] = useMemo(() => {
    return peopleFromServer.filter(
      person => person.name.trim().toLowerCase()
        .includes(appliedQuery.trim().toLowerCase()),
    );
  }, [peopleFromServer, appliedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchInput = event.target.value;

    setQuery(searchInput);
    applyQuery(searchInput);
    setIsDropdownOpen(true);

    setTimeout(() => {
      setAppliedQuery(searchInput);
      setIsDropdownOpen(false);
    }, 1000);
  };

  const handleOnClick = useCallback((person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setIsDropdownOpen(false);
  }, []);

  const dropDownOpened
    = query.length > 0 && filteredPeople.length > 0 && !isDropdownOpen;

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div
        className={classNames(
          'dropdown',
          { 'is-active': dropDownOpened },
        )}
      >
        <div className="dropdown-trigger">
          <input
            value={query}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            onChange={handleQueryChange}
          />
        </div>

        {filteredPeople.length ? (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {filteredPeople.map((person: Person) => (
                <button
                  className="dropdown-item"
                  type="button"
                  key={person.slug}
                  onClick={() => {
                    handleOnClick(person);
                    setIsDropdownOpen(false);
                  }}
                >
                  <p className="has-text-link">{person.name}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="ml-5 message">
            <div className="message-body">No matching suggestions</div>
          </div>
        )}
      </div>
    </main>
  );
};
