import React, { useState, useEffect, useRef } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';

interface Person {
  name: string;
  born: number;
  died: number;
}

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const blurTimer = useRef<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedQuery(query);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  const filteredPerson = peopleFromServer.filter(person => {
    return person.name.toLowerCase().includes(appliedQuery.toLowerCase());
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
          onClick={() => {
            setSelectedPerson(person);
            setQuery(person.name);
            setAppliedQuery(person.name);
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
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => {
                window.clearTimeout(blurTimer.current);
                setIsOpen(true);
              }}
              onBlur={() => {
                blurTimer.current = window.setTimeout(() => {
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
