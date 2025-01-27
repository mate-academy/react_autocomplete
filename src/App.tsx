import './App.scss';

import React, { useState, useEffect, useCallback } from 'react';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

type AutocompleteProps = {
  delay?: number;
  onSelected: (person: Person | null) => void;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({ delay = 300, onSelected }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [noSuggestions, setNoSuggestions] = useState(false);

  const fetchSuggestions = useCallback(() => {
    if (!query) {
      setSuggestions(peopleFromServer);
      setNoSuggestions(false);
      return;
    }

    const filtered = peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(query.toLowerCase())
    );

    setSuggestions(filtered);
    setNoSuggestions(filtered.length === 0);
  }, [query]);

  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, delay), [fetchSuggestions, delay]);

  useEffect(() => {
    debouncedFetchSuggestions();
  }, [query, debouncedFetchSuggestions]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (selectedPerson) {
      setSelectedPerson(null);
      onSelected(null);
    }
    setQuery(value);
  };

  const handleSuggestionClick = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setSuggestions([]);
    onSelected(person);
  };

  return (
    <div className="dropdown is-active" data-cy="autocomplete">
      <div className="dropdown-trigger">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
        />
      </div>

      {suggestions.length > 0 && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {suggestions.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                onClick={() => handleSuggestionClick(person)}
                data-cy="suggestion-item"
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {noSuggestions && (
        <div
          className="notification is-danger is-light mt-3"
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
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
          delay={300}
          onSelected={(person) => setSelectedPerson(person)}
        />
      </main>
    </div>
  );
};