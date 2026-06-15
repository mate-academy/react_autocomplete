import React, { useState, useEffect, useRef } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';

export interface Person {
  name: string;
  born: number;
  died: number;
}

interface Props {
  delay?: number;
  onSelected?: (person: Person | null) => void;
}

export const App: React.FC<Props> = ({ delay = 300, onSelected }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastAppliedQuery = useRef('');

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = query.trim();

      if (query !== '' && trimmed === '') {
        return;
      }

      if (query === lastAppliedQuery.current) {
        return;
      }

      setAppliedQuery(query);
      lastAppliedQuery.current = query;
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  const trimmedQuery = appliedQuery.trim();

  const filteredPerson = peopleFromServer.filter(person => {
    if (!trimmedQuery) {
      return true;
    }

    return person.name.toLowerCase().includes(trimmedQuery.toLowerCase());
  });

  let suggestionsContent;

  if (filteredPerson.length !== 0) {
    suggestionsContent = filteredPerson.map(person => {
      return (
        <div
          key={person.name}
          className="dropdown-item"
          data-cy="suggestion-item"
          style={{ cursor: 'pointer' }}
          onMouseDown={e => e.preventDefault()}
          onClick={() => {
            setSelectedPerson(person);
            onSelected?.(person);

            setQuery(person.name);
            setAppliedQuery(person.name);
            lastAppliedQuery.current = person.name;

            setIsOpen(false);
          }}
        >
          <p className="has-text-link">{person.name}</p>
        </div>
      );
    });
  } else {
    suggestionsContent = (
      <div className="dropdown-item" data-cy="no-suggestions-message">
        <p className="has-text-danger">No matching suggestions</p>
      </div>
    );
  }

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={isOpen ? 'dropdown is-active' : 'dropdown'}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={e => {
                setSelectedPerson(null);
                onSelected?.(null);

                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => {
                if (blurTimer.current) {
                  clearTimeout(blurTimer.current);
                }

                setIsOpen(true);
              }}
              onBlur={() => {
                blurTimer.current = setTimeout(() => {
                  setIsOpen(false);
                }, 200);
              }}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {isOpen && suggestionsContent}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
