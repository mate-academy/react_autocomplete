import React from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { useState, useCallback, useEffect } from 'react';
import { Person } from './types/Person';

// eslint-disable-next-line @typescript-eslint/ban-types
function debounce(callback: Function, delay: number) {
  let timerId = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any) => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const App: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');
  const [selectedGuy, setSelectedGuy] = useState<Person | null>(null);

  useEffect(() => {
    if (selectedGuy && inputValue !== selectedGuy.name) {
      setSelectedGuy(null);
    }
  }, [inputValue, selectedGuy]);
  const applyQuery = useCallback(debounce(setQuery, 300), []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event?.target.value);
    applyQuery(event?.target.value);
  };

  const onSelected = (person: Person) => {
    setSelectedGuy(person);
  };

  const visibleGuys = peopleFromServer.filter(guy => guy.name.includes(query));

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedGuy
            ? `${selectedGuy.name} (${selectedGuy.born} - ${selectedGuy.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={inputValue}
              onChange={event => handleChange(event)}
              onFocus={() => setIsVisible(true)}
            />
          </div>
          {isVisible && visibleGuys.length > 0 ? (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {visibleGuys.map(guy => (
                  <div
                    key={guy.name}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={() => {
                      setInputValue(guy.name);
                      setIsVisible(false);
                      onSelected(guy);
                    }}
                  >
                    <p className="has-text-link">{guy.name}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {visibleGuys.length === 0 && (
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
        </div>
      </main>
    </div>
  );
};
