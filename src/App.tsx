import './App.scss';
import React, { useMemo, useState, useEffect } from 'react';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

type Props = {
  debounceDelay?: number;
  onSelected?: (person: Person) => void;
};

export const App: React.FC<Props> = ({ debounceDelay = 300, onSelected }) => {
  const [searchPart, setSearchPart] = useState('');
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);
  const [display, setDisplay] = useState(false);

  const setQuery = useMemo(() => {
    return debounce((value: string) => setSearchPart(value), debounceDelay);
  }, []);

  useEffect(() => {
    return () => {
      setQuery.cancel();
    };
  }, [setQuery]);

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(searchPart.toLowerCase()),
    );
  }, [searchPart]);

  const suggestPeople = filteredPeople;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value.trim());
    setCurrentPerson(null);
    setDisplay(true);
  };

  const handleChoose = (person: Person) => {
    setCurrentPerson(person);
    setDisplay(false);
    onSelected?.(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {currentPerson ? (
          <h1 className="title" data-cy="title">
            {`${currentPerson.name} (${currentPerson.born} - ${currentPerson.died})`}
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        )}

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onChange={handleChange}
              onFocus={() => {
                setDisplay(true);
              }}
            />
          </div>
          {display && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {suggestPeople.map(person => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.name}
                    onClick={() => handleChoose(person)}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {searchPart && suggestPeople.length === 0 && display && (
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
