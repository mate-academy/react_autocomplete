import React, { useState, useRef, useEffect } from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const timerRef = useRef<number | null>(null);
  const lastQueriedTextRef = useRef<string>('');

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const filterPeople = (text: string) => {
    if (text === '') {
      return people;
    }

    return people.filter(p => p.name.toLowerCase().includes(text));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    const normalized = value.trim().toLowerCase();

    setInputValue(value);
    onSelected(null);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (normalized === '') {
      lastQueriedTextRef.current = '';
      setSuggestions([]);
      setIsOpen(false);

      return;
    }

    timerRef.current = window.setTimeout(() => {
      if (lastQueriedTextRef.current === normalized) {
        return;
      }

      lastQueriedTextRef.current = normalized;

      const results = filterPeople(normalized);

      setSuggestions(results);
      setIsOpen(true);
    }, delay);
  };

  const handleFocus = () => {
    const normalized = inputValue.trim().toLowerCase();

    if (normalized === '') {
      setSuggestions(people);
      setIsOpen(true);
    } else {
      const results = filterPeople(normalized);

      setSuggestions(results);
      setIsOpen(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setIsOpen(false), 150);
  };

  const handleSelect = (person: Person) => {
    setInputValue(person.name);
    setIsOpen(false);
    lastQueriedTextRef.current = person.name.trim().toLowerCase();
    onSelected(person);
  };

  return (
    <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Enter a part of the name"
          className="input"
          data-qa="search-input"
          data-cy="search-input"
        />
      </div>

      {isOpen && (
        <div
          className="dropdown-menu"
          role="menu"
          data-qa="suggestions-list"
          data-cy="suggestions-list"
        >
          <div className="dropdown-content">
            {suggestions.length > 0 ? (
              suggestions.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-qa="suggestion-item"
                  data-cy="suggestion-item"
                  onMouseDown={e => {
                    e.preventDefault();
                    handleSelect(person);
                  }}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))
            ) : (
              <div
                className="dropdown-item"
                data-qa="no-suggestions-message"
                data-cy="no-suggestions-message"
              >
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
