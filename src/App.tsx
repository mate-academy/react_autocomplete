import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

interface Props {
  people?: Person[];
  delay?: number;
  onSelected?: (person: Person | null) => void;
}

export const App: React.FC<Props> = ({
  people = peopleFromServer,
  delay = 300,
  onSelected,
}) => {
  const [activeSearch, setActiveSearch] = useState(false);
  const searchField = useRef<HTMLInputElement>(null); 
  const dropdown = useRef<HTMLDivElement>(null); 
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [appliedQuery, setAppliedQuery] = useState('');

  const filteredUsers = useMemo(() => {
    const normalized = appliedQuery.trim().toLowerCase();

    if (!normalized) return people;

    return people.filter(p => p.name.toLowerCase().trim().includes(normalized));
  }, [appliedQuery, people]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdown.current && !dropdown.current.contains(event.target as Node)) {
        setActiveSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const applyQueryDebounced = useCallback(
    debounce((newQuery: string) => {
      setAppliedQuery(newQuery);
    }, delay),
    [delay]
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    applyQueryDebounced(newQuery);

    setSelectedPerson(null);
    if (onSelected) {
      onSelected(null);
    }
  };

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setAppliedQuery(person.name);
    setActiveSearch(false);

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

        <div className={`dropdown ${activeSearch ? 'is-active' : ''}`} ref={dropdown}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              value={query}
              onChange={handleInputChange}
              data-cy="search-input"
              ref={searchField}
              onFocus={() => setActiveSearch(true)}
            />
          </div>

          {activeSearch && (
            <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
              <div className="dropdown-content">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(p => (
                    <a
                      key={p.name}
                      href={`#${p.name}`}
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelectPerson(p);
                      }}
                    >
                      {p.name}
                    </a>
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
      </main>
    </div>
  );
};