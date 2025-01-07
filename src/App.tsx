import React, { useCallback, useMemo, useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';

type Props = {
  delay: number;
  onSelected: (
    person: { name: string; born: number; died: number } | null,
  ) => void;
};

type Person = {
  name: string;
  born: number;
  died: number;
};

export const App: React.FC<Props> = ({ delay = 300, onSelected }) => {
  const [inputValue, setInputValue] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<{
    name: string;
    born: number;
    died: number;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSetInputValue = useMemo(
    () =>
      debounce((value: string) => {
        setInputValue(value);
      }, delay),
    [delay],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    debouncedSetInputValue(value);

    if (selectedPerson) {
      setSelectedPerson(null);
      onSelected(null);
    }
  };

  const handleSelectPerson = useCallback(
    (person: Person) => {
      setSelectedPerson(person);
      setInputValue(person.name);
      setIsDropdownVisible(false);
      onSelected(person);
    },
    [onSelected],
  );

  const filteredNames = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(inputValue.toLowerCase()),
    );
  }, [inputValue]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.born})`
            : `No selected person`}
        </h1>

        <div className={`dropdown ${isDropdownVisible ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              defaultValue={inputValue}
              onChange={handleInputChange}
              onFocus={() => setIsDropdownVisible(true)}
              onBlur={() => setTimeout(() => setIsDropdownVisible(false), 200)}
            />
          </div>

          {isDropdownVisible && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredNames.map(person => (
                  <div
                    className="dropdown-item"
                    key={person.born}
                    data-cy="suggestion-item"
                    onClick={() => handleSelectPerson(person)}
                  >
                    <p style={{ cursor: 'default' }} className="has-text-link">
                      {person.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {filteredNames.length === 0 && (
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
