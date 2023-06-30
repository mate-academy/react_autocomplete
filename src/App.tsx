import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { debounce } from './debounce';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person>();
  const [isDropDownActive, setIsDropDownActive] = useState(false);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const visiblePeople = useMemo(() => {
    return peopleFromServer.filter(
      person => person.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [appliedQuery]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setIsDropDownActive(true);
  };

  const handleSelectPerson = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    person: Person,
  ) => {
    event.preventDefault();
    setSelectedPerson(person);
    setAppliedQuery('');
    setQuery(person.name);
    setIsDropDownActive(false);
  };

  const handleInputFocus = () => {
    setIsDropDownActive(true);
  };

  const handleDropdownBlur = () => {
    setIsDropDownActive(false);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div
        className={isDropDownActive ? 'dropdown is-active' : 'dropdown'}
        onBlur={handleDropdownBlur}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={event => {
              handleInputChange(event);
            }}
            onFocus={handleInputFocus}
          />
        </div>

        <div
          className="dropdown-menu"
          role="menu"
        >
          <div className="dropdown-content">
            {visiblePeople.length
              ? visiblePeople.map(person => (
                <div
                  key={person.name}
                  className="dropdown-item"
                >
                  <button
                    type="submit"
                    onMouseDown={(event) => {
                      handleSelectPerson(event, person);
                    }}
                  >
                    <p
                      className={person.sex === 'f'
                        ? 'has-text-danger'
                        : 'has-text-link'}
                    >
                      {person.name}
                    </p>
                  </button>
                </div>
              ))
              : (
                <div className="dropdown-item">
                  No matching suggestions
                </div>
              )}
          </div>
        </div>
      </div>
    </main>
  );
};
