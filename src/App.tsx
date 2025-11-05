import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

const DEFAULT_DELAY = 300;

export const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [debounced, setDebounced] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selected, setSelected] = useState<Person | null>(null);

  const delay = DEFAULT_DELAY;

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      setDebounced(input.trim());
    }, delay);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [input, delay]);

  useEffect(() => {
    if (selected && input !== selected.name) {
      setSelected(null);
    }
  }, [input, selected]);

  const suggestions = useMemo(() => {
    const q = debounced.toLowerCase();

    if (!q) {
      return peopleFromServer;
    }

    return peopleFromServer.filter(p => p.name.toLowerCase().includes(q));
  }, [debounced]);

  const isMenuActive =
    isFocused && (!debounced || (debounced && suggestions.length > 0));

  const showNoMatches = isFocused && !!debounced && suggestions.length === 0;

  const handleSelect = (person: Person) => {
    setSelected(person);
    setInput(person.name);
    setIsFocused(false);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selected
            ? `${selected.name} (${selected.born} - ${selected.died})`
            : 'No selected person'}
        </h1>

        <div className={`dropdown ${isMenuActive ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={input}
              onChange={e => {
                setInput(e.target.value);
                setIsFocused(true);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setTimeout(() => setIsFocused(false), 100);
              }}
            />
          </div>

          {isMenuActive && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {suggestions.map(person => (
                  <div
                    key={person.slug}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => handleSelect(person)}
                  >
                    <p
                      className={
                        person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                      }
                    >
                      {person.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {showNoMatches && (
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
