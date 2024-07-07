import './App.scss';
import React, { useState, useCallback } from 'react';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [searchPart, setSearchPart] = useState('');
  const [suggestedPeople, setSuggestedPeople] = useState(peopleFromServer);
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);
  const [isDisplayed, setIsDisplayed] = useState(false);

  const filterPeople = (value: string) => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(value.toLowerCase()),
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetSearchPart = useCallback(
    debounce((value: string) => {
      setSuggestedPeople(filterPeople(value));
      setIsDisplayed(true);
    }, 300),
    [],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();

    setSearchPart(value);
    setCurrentPerson(null);
    debouncedSetSearchPart(value);
  };

  const handleChoose = (person: Person) => {
    setCurrentPerson(person);
    setSearchPart(person.name);

    setTimeout(() => {
      setIsDisplayed(false);
    }, 0);
  };

  const handleInputClick = () => {
    setSuggestedPeople(filterPeople(searchPart));
    setIsDisplayed(true);
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

        <div className={`dropdown ${isDisplayed ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={searchPart}
              onChange={handleChange}
              onClick={handleInputClick}
              onFocus={handleInputClick}
            />
          </div>

          {isDisplayed && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              {suggestedPeople.length > 0 ? (
                <div className="dropdown-content">
                  {suggestedPeople.map((person, index) => (
                    <div
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      key={index}
                      onClick={() => handleChoose(person)}
                    >
                      <p className="has-text-link">{person.name}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dropdown-item" data-cy="no-suggestions-message">
                  <p className="has-text-danger">No matching suggestions</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
