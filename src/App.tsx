import React, { useEffect, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

type AppProps = {
  debounceDelay?: number;
  onSelected?: (person: Person) => void;
};

export const App: React.FC<AppProps> = ({
  debounceDelay = 300,
  onSelected,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [inputValue, debounceDelay]);

  const filteredPeople = React.useMemo(() => {
    const trimmedValue = debouncedValue.trim();

    if (trimmedValue === '') {
      return [];
    }

    return peopleFromServer.filter(person => {
      return person.name.toLowerCase().includes(trimmedValue.toLowerCase());
    });
  }, [debouncedValue]);

  let peopleToShow: Person[] = [];

  if (isFocused) {
    if (inputValue === '') {
      peopleToShow = peopleFromServer;
    } else if (filteredPeople.length > 0) {
      peopleToShow = filteredPeople;
    }
  }

  const showNoSuggestions =
    isFocused && inputValue !== '' && filteredPeople.length === 0;

  useEffect(() => {
    if (selectedPerson && inputValue !== selectedPerson.name) {
      setSelectedPerson(null);
    }
  }, [inputValue, selectedPerson]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div
          className={`dropdown ${isFocused ? 'is-active' : ''}`}
          data-cy="dropdown"
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {peopleToShow.map(person => (
                <div
                  key={person.name}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onMouseDown={() => {
                    setInputValue(person.name);
                    setSelectedPerson(person);
                    onSelected?.(person);
                    setIsFocused(false);
                  }}
                >
                  <p
                    className={
                      person.died ? 'has-text-danger' : 'has-text-link'
                    }
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showNoSuggestions && (
          <div
            className="notification is-danger
            is-light mt-3 is-align-self-flex-start"
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
