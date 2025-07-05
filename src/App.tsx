import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [name, setName] = useState('');
  const [born, setBorn] = useState(0);
  const [died, setDied] = useState(0);
  const [filter, setFilter] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const visiblePeople = peopleFromServer.filter(person => {
    const lowerFilter = filter.toLowerCase();

    return person.name.toLowerCase().includes(lowerFilter);
  });

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const value = event.target.value;

    setInputValue(value);
    setFilter(value);
    setName('');
    setBorn(0);
    setDied(0);
  };

  const handleFocus = () => {
    setIsDropdownVisible(true);
  };

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = event => {
    const relatedTarget = event.relatedTarget as HTMLElement;

    if (relatedTarget && relatedTarget.dataset.cy === 'suggestion-item') {
      return;
    }

    setIsDropdownVisible(false);
  };

  const handleClick = (person: Person) => {
    setName(person.name);
    setBorn(person.born);
    setDied(person.died);
    setInputValue(person.name);
    setIsDropdownVisible(false);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {name === '' && born === 0 && died === 0 ? (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        ) : (
          <h1
            className="title"
            data-cy="title"
          >{`${name} (${born} - ${died})`}</h1>
        )}

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              value={inputValue}
            />
          </div>

          {isDropdownVisible && visiblePeople.length > 0 && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content" role="menu">
                {visiblePeople.map(person => {
                  return (
                    <div
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      key={person.slug}
                      tabIndex={0}
                    >
                      <p
                        className="has-text-link"
                        onMouseDown={() => handleClick(person)}
                      >
                        {person.name}
                      </p>
                    </div>
                  );
                })}
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
            <p className={visiblePeople.length === 0 ? 'has-text-danger' : ''}>
              No matching suggestions
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
