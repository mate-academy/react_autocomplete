import React, { useEffect, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person, Persons } from './Person';
import { useDebounce } from './hooks/useDebounce';

interface AppProps {
  delay?: number;
  onSelected?: (person: Person | null) => void;
}

export const App: React.FC<AppProps> = ({ delay = 300, onSelected }) => {
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const debouncedQuery = useDebounce(query, delay);

  useEffect(() => {
    if (selectedPerson && query !== selectedPerson.name) {
      setSelectedPerson(null);
      if (onSelected) {
        onSelected(null);
      }
    }
  }, [query, selectedPerson, onSelected]);

  const trimmedQuery = debouncedQuery.trim().toLowerCase();

  const filteredPeople = peopleFromServer.filter(person => {
    if (trimmedQuery === '') {
      return true;
    }

    return person.name.toLowerCase().includes(trimmedQuery);
  });

  const hasSuggestions = filteredPeople.length > 0;
  const shouldSuggestion = isFocused || trimmedQuery.length > 0;

  const handleSelectPerson = (person: Person) => {
    setQuery(person.name);
    setSelectedPerson(person);
    setIsFocused(false);
    if (onSelected) {
      onSelected(person);
    }
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={`dropdown ${shouldSuggestion ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            />
          </div>
          {shouldSuggestion && hasSuggestions && (
            <Persons persons={filteredPeople} onSelect={handleSelectPerson} />
          )}
        </div>

        {!hasSuggestions && shouldSuggestion && (
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
