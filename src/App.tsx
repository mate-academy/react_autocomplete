import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useMemo } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

interface AutocompleteProps {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpened, setIsOpened] = useState(false);

  const filteredPeople = useMemo(() => {
    return people.filter(person =>
      person.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
    );
  }, [people, debouncedQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, delay);

    return () => {
      window.clearTimeout(timer);
    };
  }, [query, delay]);

  return (
    <div className={`dropdown ${isOpened ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          data-qa="search-input"
          value={query}
          onChange={event => {
            onSelected(null);
            setQuery(event.target.value);
          }}
          onFocus={() => setIsOpened(true)}
          onBlur={() => setTimeout(() => setIsOpened(false), 200)}
        />
      </div>

      <div
        className="dropdown-menu"
        role="menu"
        data-cy="suggestions-list"
        data-qa="suggestions-list"
      >
        <div className="dropdown-content">
          {filteredPeople.map(person => (
            <div
              className="dropdown-item"
              data-cy="suggestion-item"
              data-qa="suggestion-item"
              key={person.name}
              onClick={() => {
                setQuery(person.name);
                onSelected(person);
                setIsOpened(false);
              }}
            >
              <p className="has-text-link">{person.name}</p>
            </div>
          ))}
        </div>
      </div>

      {debouncedQuery && filteredPeople.length === 0 && (
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
          data-qa="no-suggestions-message"
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
        <h1 className="title" data-cy="title" data-qa="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <Autocomplete
          people={peopleFromServer}
          onSelected={setSelectedPerson}
        />
      </main>
    </div>
  );
};
