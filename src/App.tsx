import React, { useMemo, useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

type Props = {
  delay?: number;
}

export const App: React.FC<Props> = ({ delay = 300 }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectPerson, setSelectPerson] = useState<Person | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const timer = useRef(0);

  const filteredPeople = useMemo(() => {
    const trimmedQuery = appliedQuery.trim();

  if (trimmedQuery === '') {
    return peopleFromServer;
  }
  return peopleFromServer.filter(people =>
    people.name.toLowerCase().includes(trimmedQuery.toLowerCase())
  );
}, [appliedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setSelectPerson(null);

    window.clearTimeout(timer.current);

    timer.current = window.setTimeout(() => {
      setAppliedQuery(event.target.value);
    }, delay);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (people: Person) => {
    setQuery(people.name);
    setSelectPerson(people);
    setShowSuggestions(false);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {query && !selectPerson ? (
            <p className="has-text-danger">No selected person</p>
          ) : query && filteredPeople.length === 0 ? (
            <p className="has-text-danger">No matching suggestions</p>
          ) : selectPerson ? (
            `${selectPerson.name} (${selectPerson.born} - ${selectPerson.died})`
          ) : (
            <p className="has-text-danger">No selected person</p>
          )}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => {
                setShowSuggestions(true);
              }}
            />
          </div>

          {showSuggestions && filteredPeople.length > 0 && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeople.map((people, index) => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={people.slug}
                    onClick={() => {
                      handleSuggestionClick(people);
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <p
                      className={
                        highlightedIndex === index
                          ? 'has-text-link'
                          : 'has-text-danger'
                      }
                    >
                      {people.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {selectPerson ? (
          ''
        ) : query && filteredPeople.length === 0 ? (
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
        ) : (
          ''
        )}
      </main>
    </div>
  );
};
