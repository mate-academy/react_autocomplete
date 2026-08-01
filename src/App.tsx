import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

type AutocompleteProps = {
  people: Person[];
  onSelected?: (person: Person) => void;
  onQueryChange?: (value: string) => void;
  delay?: number;
};

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  onSelected,
  onQueryChange,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Person[]>(people);
  const lastQueryRef = useRef('');

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const trimmedQuery = query.trim();

    if (trimmedQuery === '') {
      setSuggestions(people);
      lastQueryRef.current = '';

      return;
    }

    if (query === lastQueryRef.current) {
      return;
    }

    const timerId = window.setTimeout(() => {
      const nextSuggestions = people.filter(({ name }) =>
        name.toLowerCase().includes(query.toLowerCase()),
      );

      setSuggestions(nextSuggestions);
      lastQueryRef.current = query;
    }, delay);

    return () => window.clearTimeout(timerId);
  }, [delay, isOpen, people, query]);

  const handleInputChange = (value: string) => {
    setQuery(value);
    onQueryChange?.(value);
    setIsOpen(true);
  };

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setIsOpen(false);
    lastQueryRef.current = person.name;
    onSelected?.(person);
    onQueryChange?.(person.name);
  };

  const showNoSuggestions =
    isOpen && query.trim() !== '' && suggestions.length === 0;

  return (
    <>
      <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            data-cy="search-input"
            onBlur={() => setIsOpen(false)}
            onChange={event => handleInputChange(event.target.value)}
            onFocus={() => {
              setIsOpen(true);

              if (query.trim() === '') {
                setSuggestions(people);
              }
            }}
          />
        </div>

        {isOpen && (query.trim() === '' || suggestions.length > 0) && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {suggestions.map(person => (
                <button
                  key={person.slug}
                  type="button"
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onMouseDown={event => event.preventDefault()}
                  onClick={() => handleSelect(person)}
                >
                  <p
                    className={
                      person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                    }
                  >
                    {person.name}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {showNoSuggestions && (
        <div
          className={
            'notification is-danger is-light mt-3 is-align-self-flex-start'
          }
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
};

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const titleText = useMemo(() => {
    if (!selectedPerson) {
      return 'No selected person';
    }

    return `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`;
  }, [selectedPerson]);

  const handleQueryChange = (value: string) => {
    if (selectedPerson && value !== selectedPerson.name) {
      setSelectedPerson(null);
    }
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {titleText}
        </h1>

        <Autocomplete
          people={peopleFromServer}
          onSelected={setSelectedPerson}
          onQueryChange={handleQueryChange}
        />
      </main>
    </div>
  );
};
