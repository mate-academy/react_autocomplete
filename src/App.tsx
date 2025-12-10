import React, { useEffect, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

interface Props {
  delay?: number;
  onSelected?: (Person: Person) => void;
}

export const App: React.FC<Props> = ({ delay = 300, onSelected }) => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [selected, setSelected] = useState<Person | null>(null);
  const [suggestions, setSuggestions] = useState<Person[]>([]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      const q = query.trim().toLowerCase();

      if (q === '') {
        setSuggestions(focused ? peopleFromServer : []);
      } else {
        setSuggestions(
          peopleFromServer.filter(p => p.name.toLowerCase().includes(q)),
        );
      }
    }, delay);

    return () => clearTimeout(timerId);
  }, [query, focused, delay]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setFocused(true);

    if (selected) {
      setSelected(null);
    }
  };

  const handleSelect = (person: Person) => {
    setSelected(person);
    setQuery(person.name);
    setFocused(false);

    if (onSelected) {
      onSelected(person);
    }
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selected
            ? `${selected?.name} (${selected?.born} - ${selected?.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleChange}
              onFocus={() => setFocused(true)}
              onBlur={() => {
                setTimeout(() => setFocused(false), 150);
              }}
            />
          </div>
          {focused && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {suggestions.map(person => {
                  return (
                    <div
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      key={person.slug}
                      onMouseDown={() => handleSelect(person)}
                      style={{ cursor: 'pointer' }}
                    >
                      <p className="has-text-link">{person.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {suggestions.length === 0 && query !== '' && focused && (
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
