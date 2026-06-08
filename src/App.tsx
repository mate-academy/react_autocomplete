import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import classNames from 'classnames';

function debounce(
  callback: React.Dispatch<React.SetStateAction<string>>,
  delay: number,
) {
  let timer = 0;

  return (args: string) => {
    window.clearTimeout(timer);

    timer = window.setTimeout(() => callback(args), delay);
  };
}

interface Props {
  delay?: number;
  onSelected?: (person: Person) => void;
}

export const App: React.FC<Props> = ({ delay = 300, onSelected }) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const focus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focus.current) {
      focus.current.focus();
    }
  }, []);

  const [isFocused, setIsFocused] = useState(false);

  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useMemo(() => debounce(setAppliedQuery, delay), [delay]);
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPerson(null);
    setQuery(e.target.value);


    applyQuery(e.target.value);
  };

  const filteredSuggestion = useMemo(() => {
    const normalizedQuery = appliedQuery.trim().toLowerCase();
    if (normalizedQuery !== '') {
      return peopleFromServer.filter(suggestion =>
        suggestion.name.toLowerCase().includes(normalizedQuery),
      );
    }

    return peopleFromServer;
  }, [appliedQuery]);

  const handleSelect = (suggestion: Person) => {
    setSelectedPerson(suggestion);
    setQuery(suggestion.name);
    setAppliedQuery(suggestion.name);
    setIsFocused(false);

    if (onSelected) {
      onSelected(suggestion);
    }
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : `No selected person`}
        </h1>

        <div
          className={classNames('dropdown', {
            'is-active': isFocused,
          })}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              ref={focus}
              value={query}
              onChange={handleQueryChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setTimeout(() => setIsFocused(false), 0);
              }}
              data-cy="search-input"
            />
          </div>

          {isFocused && filteredSuggestion.length > 0 && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredSuggestion.map(suggestion => (
                  <div
                    key={suggestion.name}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={() => handleSelect(suggestion)}
                  >
                    <p className="has-text-link">{suggestion.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {isFocused && filteredSuggestion.length === 0 && (
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
