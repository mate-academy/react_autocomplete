import React, { useEffect, useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

interface AutocompleteProps {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [noSuggestions, setNoSuggestions] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (query === '') {
        setSuggestions(people);
        setNoSuggestions(false);
      } else {
        const filtered = people.filter(person =>
          person.name.toLowerCase().includes(query.toLowerCase()),
        );

        setSuggestions(filtered);
        setNoSuggestions(filtered.length === 0);
      }
    }, delay);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, delay, people]);

  const handleSelect = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setSuggestions([]);
    setNoSuggestions(false);
    onSelected(person);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);

    if (selectedPerson && value !== selectedPerson.name) {
      setSelectedPerson(null);
      onSelected(null);
    }
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleInputChange}
        />
        {noSuggestions && (
          <div
            className="
            notification is-danger
            is-light mt-3
            is-align-self-flex-start"
            role="alert"
          >
            <p className="has-text-danger" data-cy="no-suggestions-message">
              No matching suggestions
            </p>
          </div>
        )}
      </div>
      {suggestions.length > 0 && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content" data-cy="suggestions-list">
            {suggestions.map(person => (
              <div
                key={person.name}
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => handleSelect(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>
        <Autocomplete
          people={peopleFromServer}
          onSelected={setSelectedPerson}
          delay={300}
        />
      </main>
    </div>
  );
};
