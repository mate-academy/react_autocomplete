import debounce from 'lodash.debounce';
import React, { useState, ChangeEvent, useMemo } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
// import { event } from 'cypress/types/jquery';

export const App: React.FC = () => {
  // const { name, born, died } = peopleFromServer[0];
  const delay: number = 300;

  const [showList, setShowList] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [inputName, setInputName] = useState('');
  const [people, setPeople] = useState<Person[]>([...peopleFromServer]);
  const [hasMatchedError, setHasMatchedError] = useState(false);

  const filterSuggestions = (value: string) => {
    const trimmed = value.trim();

    if (trimmed === '') {
      setPeople([...peopleFromServer]);
      setHasMatchedError(false);

      return;
    }

    const filtered = peopleFromServer.filter(p =>
      p.name.toLowerCase().includes(trimmed.toLowerCase()),
    );

    setPeople(filtered);
    setHasMatchedError(filtered.length === 0);
  };

  // useMemo/useCallback для debounce
  const debouncedFilter = useMemo(
    () => debounce(filterSuggestions, delay),
    [delay],
  );
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setInputName(value);
    debouncedFilter(value);
    setShowList(true);
    setHasMatchedError(false);
    setSelectedPerson(null);

    if (value === '') {
      setShowList(false);
      setSelectedPerson(null);
    }

    if (people.length === 0) {
      setHasMatchedError(true);
    }
  };

  const handleSelectedPerson = (person: Person) => {
    setSelectedPerson(person);
    setInputName(person.name);
    setShowList(false);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson?.name}
          (${selectedPerson?.born} - ${selectedPerson?.died})`
            : `No selected person`}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              value={inputName}
              onChange={onChange}
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
            />
          </div>

          {showList && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {people.map((person, idx) => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={idx}
                    onClick={() => handleSelectedPerson(person)}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {hasMatchedError && (
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
