import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [name, setName] = useState('');
  const [born, setBorn] = useState(0);
  const [died, setDied] = useState(0);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [query, setQuery] = useState('');

  const visiblePeople = peopleFromServer.filter(person => {
    const filterLower = query.toLowerCase();

    return person.name.toLowerCase().includes(filterLower);
  });

  const handleClick = (person: Person) => {
    setQuery(person.name);
    setIsDropdownVisible(false);
    setName(person.name);
    setBorn(person.born);
    setDied(person.died);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);

    setName('');
    setBorn(0);
    setDied(0);
  };

  const handleQueryFocus = () => {
    setIsDropdownVisible(true);
  };

  const handleQueryBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const relatedTarget = event.relatedTarget as HTMLElement;

    if (relatedTarget && relatedTarget.dataset.cy === 'suggestion-item') {
      return;
    }

    setIsDropdownVisible(false);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {name !== '' && born !== 0 && died !== 0 ? (
          <h1 className="title" data-cy="title">
            {`${name} (${born} - ${died})`}
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            No selected person.
          </h1>
        )}

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
              onFocus={handleQueryFocus}
              onBlur={handleQueryBlur}
            />
          </div>
          {isDropdownVisible && visiblePeople.length !== 0 && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {visiblePeople.map(person => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.slug}
                  >
                    <p
                      className="has-text-link"
                      onMouseDown={() => handleClick(person)}
                    >
                      {person.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {visiblePeople.length === 0 && (
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
