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
  const lastQueriedTextRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const filterPeople = (text: string) => {
    const query = text.trim().toLocaleLowerCase();

    if (query === '') {
      return people;
    }

    return people.filter(p => p.name.toLocaleLowerCase().includes(query));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;

    setInputValue(value);
    onSelected(null);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      if (lastQueriedTextRef.current === value) {
        return;
      }

      lastQueriedTextRef.current = value;

      const results = filterPeople(value);

      setSuggestions(results);
      setIsOpen(true);
    }, delay);
  };

  const handleFocus = () => {
    if (inputValue.trim() === '') {
      setSuggestions(people);
      setIsOpen(true);
    } else {
      const results = filterPeople(inputValue);

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
    lastQueriedTextRef.current = person.name;
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
          data-cy="search-input"
        />
      </div>

      {isOpen && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {suggestions.length > 0 ? (
              suggestions.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
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
              <div className="dropdown-item" data-cy="no-suggestions-message">
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
