import React, { useState, useEffect, useRef } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { PersonFromList } from './components/PersonFromList';
import { Person } from './types/Person';

type Props = {
  debounceDelay?: number;
  onSelected?: (person: (typeof peopleFromServer)[0] | null) => void;
};

export const App: React.FC<Props> = ({
  debounceDelay = 300,
  onSelected = () => {},
}) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredPeople, setFilteredPeople] = useState(peopleFromServer);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const prevInputRef = useRef('');

  useEffect(() => {
    const handler = setTimeout(() => {
      const normalizedInput = inputValue.trim().toLowerCase();

      if (prevInputRef.current === normalizedInput) {
        return;
      }

      prevInputRef.current = normalizedInput;

      if (!normalizedInput) {
        setFilteredPeople(peopleFromServer);
      } else {
        const matches = peopleFromServer.filter(person =>
          person.name.toLowerCase().includes(normalizedInput),
        );

        setFilteredPeople(matches);
      }

      if (
        selectedPerson &&
        normalizedInput !== selectedPerson.name.toLowerCase()
      ) {
        setSelectedPerson(null);
        onSelected(null);
      }
    }, debounceDelay);

    return () => clearTimeout(handler);
  }, [inputValue, debounceDelay, onSelected, selectedPerson]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setIsDropdownOpen(true);
  };

  const handlePersonClick = (person: (typeof peopleFromServer)[0]) => {
    setInputValue(person.name);
    setSelectedPerson(person);
    onSelected(person);
    setIsDropdownOpen(false);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'Choose a person'}
        </h1>

        <div className={`dropdown ${isDropdownOpen ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setIsDropdownOpen(true)}
            />
          </div>

          {isDropdownOpen && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeople.length > 0 ? (
                  filteredPeople.map(pupil => (
                    <div
                      key={pupil.name}
                      onClick={() => handlePersonClick(pupil)}
                      role="button"
                      tabIndex={0}
                      className="dropdown-item"
                    >
                      <PersonFromList pupil={pupil} />
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
