import React, { useState, useEffect } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

interface AppProps {
  debounceDelay: number;
}

export const App: React.FC<AppProps> = ({ debounceDelay }) => {
  const [text, setInput] = useState('');
  const [onFocus, setOnFocus] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [debouncedInput, setDebouncedInput] = useState('');

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setDebouncedInput(text);
    }, debounceDelay);

    return () => clearTimeout(debounceTimeout);
  }, [text, debounceDelay]);

  const handleSuggestionClick = (person: Person) => {
    setInput(person.name);
    setSelectedPerson(person);
    setOnFocus(false);
  };

  function filteredPeople(people: Person[], input: string) {
    return people.filter(person => person.name
      .toLowerCase()
      .includes(input.toLowerCase()));
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);

    setSelectedPerson(null);
    setOnFocus(true);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})` : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={text}
            onChange={handleInputChange}
            onFocus={() => setOnFocus(true)}
          />
        </div>

        {(debouncedInput || onFocus) && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {filteredPeople(peopleFromServer, debouncedInput).length === 0 ? (
                <div className="dropdown-item">No matching suggestions</div>
              ) : (
                filteredPeople(peopleFromServer, debouncedInput).map(person => (
                  <div
                    className="dropdown-item"
                    key={person.slug}
                    onClick={() => handleSuggestionClick(person)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSuggestionClick(person);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
