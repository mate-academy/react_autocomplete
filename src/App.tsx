import React, { useEffect, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timer = setTimeout(() => {
      const normalizedQuery = query.trim().toLowerCase();

      if (!normalizedQuery) {
        setSuggestions(peopleFromServer);

        return;
      }

      const filteredPeople = peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(normalizedQuery),
      );

      setSuggestions(filteredPeople);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setSelectedPerson(null);
    setIsOpen(true);
  };

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setSelectedPerson(person);
    setIsOpen(false);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div
          className={`dropdown ${isOpen && suggestions.length > 0 ? 'is-active' : ''}`}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleChange}
              onFocus={() => setIsOpen(true)}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {suggestions.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => handleSelect(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {isOpen && query.trim() !== '' && suggestions.length === 0 && (
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
