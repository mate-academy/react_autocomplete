import React, { useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filteredPeople, setFilteredPeople] = useState(peopleFromServer);
  const [isActive, setIsActive] = useState(false);
  const [item, setItem] = useState<Person | null>(null);

  const handleFocus = () => {
    setIsActive(!isActive);
  };

  const handleSearchChange = debounce((query: string) => {
    setFilteredPeople(
      peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(query.toLowerCase()),
      ),
    );
  }, 300);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;

    setSearch(query);
    handleSearchChange(query);
  };

  const handleItemClick = (people: Person) => {
    setItem(people);
    setIsActive(false);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {!item ? (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            {`${item?.name} (${item?.born} - ${item?.died})`}
          </h1>
        )}

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={search}
              onChange={handleInputChange}
              onFocus={handleFocus}
            />
          </div>

          {isActive && filteredPeople.length !== 0 && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeople.map(people => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={() => handleItemClick(people)}
                    key={people.name}
                  >
                    <p className="has-text-link">{people.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {filteredPeople.length === 0 && (
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
