import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  // const { name, born, died } = peopleFromServer[0];
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isDropdownActive, setIsDropdownActive] = useState(true);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  // const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const applyQuery = useMemo(
    () =>
      debounce(value => {
        setAppliedQuery(value);
      }, 300),
    [],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsDropdownActive(true);
    setSelectedPerson(null);

    applyQuery(event.target.value);
  };

  const handleClick = (person: Person) => {
    setSelectedPerson(person);
    setIsDropdownActive(false);
  };

  const filterPeople = useMemo(() => {
    return peopleFromServer.filter(peop =>
      peop.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={`dropdown ${isDropdownActive ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleInputChange}
            />
          </div>

          {isDropdownActive && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filterPeople.length > 0 ? (
                  filterPeople.map(person => (
                    <div
                      className="dropdown-item"
                      key={person.slug}
                      data-cy="suggestion-item"
                    >
                      <p
                        className="has-text-link"
                        onClick={() => handleClick(person)}
                      >
                        {person.name}
                      </p>
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
        </div>
      </main>
    </div>
  );
};
