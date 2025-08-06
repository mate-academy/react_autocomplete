import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

interface AutocompleteProps {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [prevQuery, setPrevQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const filterSuggestions = useCallback(() => {
    if (!query.trim()) {
      setSuggestions(people);
    } else {
      const filtered = people.filter(person =>
        person.name.toLowerCase().includes(query.toLowerCase()),
      );

      setSuggestions(filtered);
    }
  }, [people, query]);

  useEffect(() => {
    if (query === prevQuery) {
      return;
    }

    setPrevQuery(query);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      filterSuggestions();
      setIsOpen(true);
    }, delay);
  }, [query, prevQuery, delay, filterSuggestions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSelected(null);
  };

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setIsOpen(false);
    onSelected(person);
  };

  const handleFocus = () => {
    if (!query.trim()) {
      setSuggestions(people);
    }

    setIsOpen(true);
  };

  return (
    <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          data-cy="search-input"
        />
      </div>

      {isOpen && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {suggestions.length > 0 ? (
              suggestions.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => handleSelect(person)}
                >
                  <p
                    className={
                      person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                    }
                  >
                    {person.name}
                  </p>
                </div>
              ))
            ) : (
              <div className="dropdown-item" data-cy="no-suggestions-message">
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )}
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
          delay={300}
          onSelected={setSelectedPerson}
        />
      </main>
    </div>
  );
};
