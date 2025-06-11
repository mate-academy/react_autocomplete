import React, { useEffect, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [rawInputValue, setRawInputValue] = useState('');
  const [debouncedInputValue, setDebouncedInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const debounceSetInputValue = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedInputValue(value);
      }, 300),
    [],
  );

  useEffect(() => {
    debounceSetInputValue(rawInputValue);
  }, [rawInputValue, debounceSetInputValue]);

  useEffect(() => {
    return () => {
      debounceSetInputValue.cancel();
    };
  }, [debounceSetInputValue]);

  useEffect(() => {
    if (selectedPerson && debouncedInputValue !== selectedPerson.name) {
      setSelectedPerson(null);
    }
  }, [debouncedInputValue, selectedPerson]);

  const onSuggestionClick = (person: Person) => {
    setRawInputValue(person.name);
    setDebouncedInputValue(person.name);
    setSelectedPerson(person);
    setShowDropdown(false);
  };

  const filteredPeople: Person[] = peopleFromServer.filter(person =>
    person.name.toLowerCase().includes(debouncedInputValue.toLowerCase()),
  );

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={`dropdown ${showDropdown ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={rawInputValue}
              onChange={e => setRawInputValue(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onBlur={e => {
                if (
                  e.relatedTarget &&
                  (e.relatedTarget as HTMLElement).closest('.dropdown-menu')
                ) {
                  return;
                }

                setShowDropdown(false);
              }}
            />
          </div>

          {showDropdown && (
            <div className="dropdown-menu" role="menu">
              <div className="dropdown-content" data-cy="suggestions-list">
                {rawInputValue && filteredPeople.length === 0 && (
                  <div
                    className="dropdown-item"
                    role="alert"
                    data-cy="no-suggestions-message"
                  >
                    <p className="has-text-danger">No matching suggestions</p>
                  </div>
                )}

                {filteredPeople.map((person, index) => (
                  <div
                    key={index}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onMouseDown={() => onSuggestionClick(person)}
                  >
                    <p
                      className={
                        person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                      }
                    >
                      {person.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
