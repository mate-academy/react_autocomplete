import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import './App.scss';
import { peopleFromServer, Person } from './data/people';

// Тип пропсів для дебаунсу
interface AppProps {
  debounceDelay?: number;
}

// Дефолтне значення дебаунсу — 300ms
export const App: React.FC<AppProps> = ({ debounceDelay = 300 }) => {
  const [query, setQuery] = useState('');
  const [filteredPeople, setFilteredPeople] =
    useState<Person[]>(peopleFromServer);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [noSuggestions, setNoSuggestions] = useState(false);

  const debounceTimerRef = useRef<number | undefined>(undefined);
  const lastQueryRef = useRef<string>('');

  const filterPeople = (text: string) => {
    if (!text.trim()) {
      setFilteredPeople(peopleFromServer);
      setNoSuggestions(false);

      return;
    }

    const matches = peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(text.toLowerCase()),
    );

    setFilteredPeople(matches);
    setNoSuggestions(matches.length === 0);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);
    setIsOpen(true);

    if (selectedPerson) {
      setSelectedPerson(null);
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      if (lastQueryRef.current !== value) {
        filterPeople(value);
        lastQueryRef.current = value;
      }
    }, debounceDelay);
  };

  const handleFocus = () => {
    setIsOpen(true);
    if (!query.trim()) {
      setFilteredPeople(peopleFromServer);
      setNoSuggestions(false);
    }
  };

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setSelectedPerson(person);
    setIsOpen(false);
  };

  useEffect(() => {
    return () => {
      clearTimeout(debounceTimerRef.current);
    };
  }, []);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleInputChange}
              onFocus={handleFocus}
            />
          </div>

          {isOpen && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeople.map(person => (
                  <div
                    key={person.id} // Використовуємо унікальний id
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={() => handleSelect(person)}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))}

                {noSuggestions && (
                  <div
                    // eslint-disable-next-line max-len
                    className="notification is-danger is-light mt-3 is-align-self-flex-start"
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
