import React, { useCallback, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

function filterPeople(peopleArr: Person[], query: string): Person[] {
  return peopleArr.filter(person => person.name.includes(query));
}

export const App: React.FC = () => {
  const [people, setPeople] = useState<Person[]>(peopleFromServer);
  const [focus, setFocus] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleSearch = useCallback(
    debounce((text: string) => {
      setPeople(filterPeople(peopleFromServer, text));
    }, 300),
    [],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;

    setSelectedPerson(null);
    handleSearch(text);
    handleSearch(text);
  };

  const handleSelect = (person: Person) => {
    setSelectedPerson(person);
    setFocus(false);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onFocus={() => {
                setFocus(true);
              }}
              onBlur={() => {
                setFocus(false);
              }}
              onChange={handleInputChange}
            />
          </div>

          {focus && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {people.length > 0 ? (
                  people.map((person, index) => (
                    <div
                      key={index}
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      onMouseDown={() => handleSelect(person)}
                    >
                      <p className="has-text-link">{person.name}</p>
                    </div>
                  ))
                ) : (
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
            </div>
          )}
          {/* <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-link">Pieter Haverbeke</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-link">Pieter Bernard Haverbeke</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-link">Pieter Antone Haverbeke</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-danger">Elisabeth Haverbeke</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-link">Pieter de Decker</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-danger">Petronella de Decker</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-danger">Elisabeth Hercke</p>
              </div>
            </div>
          </div> */}
        </div>

        {/* <div
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
        </div> */}
      </main>
    </div>
  );
};
