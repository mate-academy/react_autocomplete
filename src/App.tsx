import { useState, ChangeEvent, FC, useEffect, useRef } from 'react';
import { peopleFromServer } from './data/people';
import DropdownContent from './components/DropdownContent';
import './App.scss';
import { Person } from './types/Person';

export const App: FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPeople, setFilteredPeople] = useState(peopleFromServer);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [prevTerm, setPrevTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [personSelected, setPersonSelected] = useState(false);

  const debounceDelay = useRef<number>(300);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceDelay.current);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm === prevTerm) {
      return;
    }

    const filtered = peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(debouncedSearchTerm),
    );

    setFilteredPeople(filtered);
    setPrevTerm(debouncedSearchTerm);
    setPersonSelected(false);
  }, [debouncedSearchTerm, prevTerm]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();

    setSearchTerm(value);
    if (value === '') {
      setFilteredPeople(peopleFromServer);
    }

    if (selectedPerson) {
      setSelectedPerson(null);
    }

    setPersonSelected(false);
  };

  const handleSelectPerson = (person: Person) => {
    setSearchTerm(person.name);
    setSelectedPerson(person);
    setFilteredPeople([]);
    setIsFocused(false);
    setPersonSelected(true);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (!searchTerm) {
      setFilteredPeople(peopleFromServer);
    }
  };

  const showErrorMessage =
    !personSelected &&
    filteredPeople.length === 0 &&
    searchTerm &&
    !selectedPerson;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={`dropdown ${isFocused ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={handleFocus}
            />
          </div>

          {isFocused && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <DropdownContent
                people={filteredPeople}
                onSelectPerson={handleSelectPerson}
              />
            </div>
          )}
        </div>

        {showErrorMessage && (
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
