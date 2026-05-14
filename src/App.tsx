import React, { useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';

type Person = (typeof peopleFromServer)[number];

type Props = {
  onSelected?: (person: Person) => void;
  delay?: number;
};

export const App: React.FC<Props> = ({ onSelected, delay = 300 }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const normalizedQuery = debouncedQuery.trim().toLowerCase();

  let filteredPeople = peopleFromServer;

  if (normalizedQuery) {
    filteredPeople = peopleFromServer.filter(person => {
      return person.name.toLowerCase().includes(normalizedQuery);
    });
  }

  const applyDebounce = useMemo(() => {
    return debounce((value: string) => {
      setDebouncedQuery(value);
    }, delay);
  }, []);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={event => {
                setQuery(event.target.value);
                setSelectedPerson(null);

                applyDebounce(event.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => {
                    setSelectedPerson(person);
                    setQuery(person.name);
                    setDebouncedQuery(person.name);
                    setIsOpen(false);

                    onSelected?.(person);
                  }}
                >
                  <p>{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {query !== '' && filteredPeople.length === 0 && (
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
