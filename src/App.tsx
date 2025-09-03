import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [dropdown, setDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<
    (typeof peopleFromServer)[0] | null
  >(null);

  const filteredPeople = searchValue.trim()
    ? peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(searchValue.toLowerCase().trim()),
      )
    : peopleFromServer;

  const debouceSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchValue(value);
        setSelectedPerson(null);
      }, 300),
    [],
  );

  const handleSelect = (person: (typeof peopleFromServer)[0]) => {
    setSelectedPerson(person);
    setDropdown(false);
    setSearchValue('');
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={`dropdown ${dropdown ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onChange={event => debouceSearch(event.target.value)}
              onFocus={() => setDropdown(true)}
              value={searchValue}
            />
          </div>

          {dropdown && (
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
                    key={person.name}
                    onClick={() => handleSelect(person)}
                    style={{ cursor: 'pointer' }}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {!filteredPeople.length && dropdown && (
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
