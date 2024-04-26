import React, { useEffect, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [personSuggestions, setPersonSuggestions] = useState<Person[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;

    setQuery(text);
    if (text.trim() === '') {
      setPersonSuggestions(peopleFromServer);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestions = (person: Person) => {
    setQuery(person.name);
    setSelectedPerson(person);
    setShowSuggestions(false);
  };

  const handleInputBlur = () => {
    setSelectedPerson(null);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filtered = peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(query.toLowerCase()),
      );

      setPersonSuggestions(filtered);
      setShowSuggestions(true);
    });

    return () => clearTimeout(timeoutId);
  }, [query]);

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
              value={query}
              onChange={handleInputChange}
              onFocus={() => setQuery('')}
              onClick={handleInputBlur}
            />
          </div>

          {showSuggestions && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {personSuggestions.length === 0 && (
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
                {personSuggestions.map(person => (
                  <div
                    key={person.name}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={() => handleSuggestions(person)}
                  >
                    <p
                      className={
                        person === selectedPerson
                          ? 'has-text-link'
                          : 'has-text-danger'
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
