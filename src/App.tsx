import './App.scss';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';
import React, { useEffect, useMemo, useState } from 'react';
import { Autocomplete } from './component/Autocomplete';

type AppProps = {
  debounceDelay?: number;
};

export const App: React.FC<AppProps> = ({ debounceDelay = 300 }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isDropDownActive, setIsDropDownActive] = useState(false);
  const [isInputFocused, setIsInpunFocused] = useState(false);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setSelectedPerson(null);
    setIsDropDownActive(true);
  };

  const handleSelected = (person: Person) => {
    setQuery(person.name);
    setSelectedPerson(person);
    setIsDropDownActive(false);
  };

  const handleDeleteClick = () => {
    setQuery('');
    setSelectedPerson(null);
    setIsDropDownActive(false);
  };

  const filltered = useMemo(() => {
    if (isInputFocused && query === '') {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
    );
  }, [debouncedQuery, isInputFocused, query]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceDelay);

    return () => {
      clearTimeout(handler);
    };
  }, [query, debounceDelay]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={`dropdown ${isDropDownActive ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => {
                setIsDropDownActive(true);
                setIsInpunFocused(true);
              }}
            />

            {isDropDownActive && (
              <button className="delete" onClick={handleDeleteClick}></button>
            )}
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <Autocomplete people={filltered} onSelected={handleSelected} />
          </div>
        </div>

        {query && filltered.length === 0 && (
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
