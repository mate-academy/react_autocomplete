import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

const preparePeople = (people: Person[], searchQuery: string) => {
  if (searchQuery) {
    return people.filter(person =>
      person.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  return [...people];
};

export const App: React.FC = () => {
  const [inputField, setInputField] = useState('');
  const [appliedInputField, setAppliedInputField] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isVisibleDropDown, setIsVisibleDropDown] = useState(false);

  const debounceQuery = useCallback(debounce(setAppliedInputField, 300), []);

  const handleSearchQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsVisibleDropDown(true);
    setSelectedPerson(null);
    setInputField(event.target.value);
    debounceQuery(event.target.value);
  };

  const handleSelectedPeopleClick = (person: Person) => {
    setSelectedPerson(person);
    setIsVisibleDropDown(false);
    setInputField(person.name);
  };

  const handleInputOnBlur = () => {
    setTimeout(() => {
      setIsVisibleDropDown(false);
    }, 150);
  };

  const filteredPeople = useMemo(() => {
    return preparePeople(peopleFromServer, appliedInputField);
  }, [appliedInputField]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : `No selected person`}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              value={inputField}
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onChange={handleSearchQuery}
              onFocus={() => setIsVisibleDropDown(true)}
              onBlur={handleInputOnBlur}
            />
          </div>

          {isVisibleDropDown && !!filteredPeople.length && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeople.map(person => {
                  return (
                    <div
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      key={person.slug}
                      onClick={() => handleSelectedPeopleClick(person)}
                    >
                      {person.sex === 'f' ? (
                        <p className="has-text-danger">{person.name}</p>
                      ) : (
                        <p className="has-text-link">{person.name}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {!filteredPeople.length && (
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
