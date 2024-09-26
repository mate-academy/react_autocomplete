import React, { useCallback, useState } from 'react';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';

import { Person } from './types/Person';

import './App.scss';

export const App: React.FC = () => {
  const [activeDropDown, setActiveDropDown] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [querry, setQuerry] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | {}>({});

  const applyQuerry = useCallback(debounce(setQuerry, 300), []);

  const handleQuerry = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPerson({});
    setSearchInput(event.target.value);
    applyQuerry(event.target.value.toLowerCase());
  };

  const filteredPeople = peopleFromServer.filter((person: Person) => {
    const normilizeName = person.name.toLowerCase();

    return normilizeName.includes(querry);
  });

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    setActiveDropDown(false);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {Object.hasOwn(selectedPerson, 'name')
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : `No selected person`}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              value={searchInput}
              onChange={event => handleQuerry(event)}
              onFocus={() => setActiveDropDown(true)}
              data-cy="search-input"
            />
          </div>

          {activeDropDown && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeople.map(person => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.slug}
                    onClick={() => handleSelectPerson(person)}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {activeDropDown && filteredPeople.length === 0 && (
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
