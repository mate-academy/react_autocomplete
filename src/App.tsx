import './App.scss';
import React, { useMemo, useState } from 'react';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [searchPart, setSearchPart] = useState('');
  const [suggestedPeople, setSuggestedPeople] = useState(peopleFromServer);
  const [currentPerson, setCurrentPerson] = useState<Person | null>(
    peopleFromServer[0],
  );
  const [isDisplayed, setIsDisplayed] = useState(false);

  const setQueryWithDelay = useMemo(() => {
    return debounce((value: string) => setSearchPart(value), 300);
  }, [setSearchPart]);

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(searchPart.toLowerCase()),
    );
  }, [searchPart]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQueryWithDelay(event.target.value.trim());
    setSuggestedPeople(filteredPeople);
    setIsDisplayed(true);
    setCurrentPerson(null);
  };

  const handleChoose = (person: Person) => {
    setCurrentPerson(person);
    setIsDisplayed(false);
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
              onClick={() => {
                setIsDisplayed(true);
              }}
            />
          </div>

          {isDisplayed && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
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
            </div>
          )}
        </div>

        {searchPart && suggestedPeople.length === 0 && isDisplayed && (
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
