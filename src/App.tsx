import React, { useState, useEffect, useRef } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';

export interface Person {
  name: string;
  sex: 'm' | 'f';
  born: number;
  died: number;
  fatherName: string | null;
  motherName: string | null;
  slug: string;
}

const DEBOUNCE_DELAY = 300;

export const App: React.FC = () => {
  const people: Person[] = peopleFromServer as Person[];

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;

    setQuery(nextValue);

    setSelectedPerson(null);
  };

  const handleSuggestionClick = (person: Person) => {
    setQuery(person.name);
    setDebouncedQuery(person.name);
    setIsOpen(false);
    setSelectedPerson(person);
  };

  let filteredPeople = people;

  if (debouncedQuery.trim() !== '') {
    filteredPeople = people.filter((person) =>
      person.name.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }

  const hasNoMatches =
    debouncedQuery.trim() !== '' && filteredPeople.length === 0;

  return (
    <div className="container">
      <main
        className="section is-flex is-flex-direction-column"
        style={{ maxWidth: '600px', margin: '0 auto' }}
      >
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div
          className={`dropdown ${isOpen ? 'is-active' : ''}`}
          ref={dropdownRef}
          style={{ width: '100%' }}
        >
          <div className="dropdown-trigger" style={{ width: '100%' }}>
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleInputChange}
              onFocus={() => setIsOpen(true)}
            />
          </div>

          {isOpen && filteredPeople.length > 0 && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
              style={{ width: '100%' }}
            >
              <div className="dropdown-content">
                {filteredPeople.map(person => {
                  const textClass =
                    person.sex === 'f' ? 'has-text-danger' : 'has-text-link';

                  return (
                    <div
                      key={person.slug}
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSuggestionClick(person)}
                    >
                      <p className={textClass}>{person.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isOpen && hasNoMatches && (
            <div
              className="notification is-danger is-light
              mt-3 is-align-self-flex-start"
              role="alert"
              data-cy="no-suggestions-message"
            >
              <p className="has-text-danger">No matching suggestions</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
