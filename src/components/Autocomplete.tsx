import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Person } from '../types/Person';

type AutocompleteProps = {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
};

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  const [input, setInput] = useState('');
  const [debounced, setDebounced] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedLocal, setSelectedLocal] = useState<Person | null>(null);

  // --- debounce ---
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
    if (selectedLocal && input !== selectedLocal.name) {
      setSelectedLocal(null);
      onSelected(null);
    }
  }, [input, selectedLocal, onSelected]);

  const suggestions = useMemo(() => {
    const q = debounced.toLowerCase();

    if (!q) {
      return people;
    }

    return people.filter(p => p.name.toLowerCase().includes(q));
  }, [debounced, people]);

  const isMenuActive = isFocused && (!debounced || suggestions.length > 0);
  const showNoMatches = isFocused && !!debounced && suggestions.length === 0;

  const handleSelect = (person: Person) => {
    setSelectedLocal(person);
    setInput(person.name);
    setIsFocused(false);
    onSelected(person);
  };

  return (
    <div className={`dropdown ${isMenuActive ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={input}
          onChange={event => {
            setInput(event.target.value);
            setIsFocused(true);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setTimeout(() => setIsFocused(false), 100);
          }}
        />
      </div>

      {isMenuActive && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {suggestions.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                onMouseDown={mouseEvent => mouseEvent.preventDefault()}
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

      {showNoMatches && (
        <div
          className="notification is-danger
          is-light mt-3 is-align-self-flex-start"
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </div>
  );
};
