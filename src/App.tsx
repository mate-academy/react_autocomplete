import React, { useState, useEffect } from 'react';
import './App.scss';
import { Person } from './types/Person';

interface AppProps {
  people: Person[];
  onSelected: (person: Person) => void;
  debounceDelay?: number;
}

export const App: React.FC<AppProps> = ({
  people,
  onSelected,
  debounceDelay = 300,
}) => {
  const [input, setInput] = useState('');
  const [filteredPeople, setFilteredPeople] = useState<Person[]>(people);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const trimmedInput = input.trim();

      if (trimmedInput === '') {
        setFilteredPeople(people);
      } else {
        setFilteredPeople(
          people.filter(person =>
            person.name.toLowerCase().includes(trimmedInput.toLowerCase()),
          ),
        );
      }
    }, debounceDelay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [input, people, debounceDelay]);

  const onPersonSelect = (person: Person) => {
    setSelectedPerson(person);
    setInput(person.name);
    onSelected(person);
  };

  useEffect(() => {
    if (selectedPerson && input !== selectedPerson.name) {
      setSelectedPerson(null);
    }
  }, [input, selectedPerson]);

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
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.length === 0 ? (
                <div className="dropdown-item" data-cy="no-suggestions-message">
                  <p className="has-text-danger">No matching suggestions</p>
                </div>
              ) : (
                filteredPeople.map(person => (
                  <div
                    key={`${person.slug}-${person.born}`}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={() => onPersonSelect(person)}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export type { Person };
