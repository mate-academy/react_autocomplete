import React, { useMemo, useRef, useState } from 'react';
import { Person } from '../types/Person';

type AutocompleteProps = {
  people: Person[];
  delay?: number;
  onSelected: (person: Person) => void;
  onQueryChange?: (query: string) => void;
};

function debounce<T extends (...args: Parameters<T>) => void>(
  callback: T,
  delay: number,
) {
  let timerId: number | null = null;

  return (...args: Parameters<T>) => {
    if (timerId !== null) {
      window.clearTimeout(timerId);
    }

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  delay = 300,
  onSelected,
  onQueryChange,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const lastQueryRef = useRef('');

  const applyQuery = useMemo(() => {
    return debounce((value: string) => {
      if (value === lastQueryRef.current) {
        return;
      }

      lastQueryRef.current = value;
      setQuery(value);
    }, delay);
  }, [delay]);

  const filteredPeople = useMemo(() => {
    if (query === '') {
      return people;
    }

    const normalizedQuery = query.toLowerCase();

    return people.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  }, [people, query]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const normalizedValue = rawValue.trim();

    setInputValue(rawValue);
    onQueryChange?.(normalizedValue);
    applyQuery(normalizedValue);
  };

  const handleSelect = (person: Person) => {
    setInputValue(person.name);
    setQuery(person.name);
    lastQueryRef.current = person.name;
    onSelected(person);
    setIsOpen(false);
  };

  const handleWrapperBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node)) {
      return;
    }

    setIsOpen(false);
  };

  return (
    <div
      className={`dropdown ${isOpen ? 'is-active' : ''}`}
      onBlur={handleWrapperBlur}
      onFocus={() => {
        setIsOpen(true);
      }}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={inputValue}
          onChange={handleInputChange}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredPeople.map(person => (
            <button
              type="button"
              className="dropdown-item"
              data-cy="suggestion-item"
              key={person.slug}
              onClick={() => {
                handleSelect(person);
              }}
            >
              <p className="has-text-link">{person.name}</p>
            </button>
          ))}
        </div>
      </div>

      {isOpen && query !== '' && filteredPeople.length === 0 && (
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
    </div>
  );
};
