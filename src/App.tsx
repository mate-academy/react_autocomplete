import React, { useState, useEffect } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

type Props = {
  onDebounce?: (delay: number) => void;
  onSelected?: (person: Person | null) => void;
  debounceDelay?: number;
};

export const App: React.FC<Props> = ({
  onDebounce,
  onSelected,
  debounceDelay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [people] = useState(peopleFromServer);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isListVisible, setIsListVisible] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onDebounce?.(debounceDelay);
    }, debounceDelay);

    return () => clearTimeout(timeoutId);
  }, [debounceDelay, onDebounce]);

  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(query.toLowerCase()),
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsListVisible(true);
    if (selectedPerson && selectedPerson.name !== event.target.value) {
      setSelectedPerson(null);
    }
  };

  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setIsListVisible(false);
    onSelected?.(person); // Передаємо об'єкт `Person` напряму
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>
        {isListVisible && filteredPeople.length === 0 && (
          <div data-cy="no-suggestions-message">No matching suggestions</div>
        )}
        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              onClick={() => setIsListVisible(true)}
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
            />
          </div>
          {isListVisible && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeople.map(person => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.slug}
                    onClick={() => handlePersonSelect(person)}
                  >
                    <p className="has-text-link">{person.name}</p>
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
