import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Person } from '../types/Person';

interface Props {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [debounceQuery, setDebounceQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const previousQueryRef = useRef('');

  const lastResultRef = useRef<Person[]>(people);

  const filteredPeople = useMemo(() => {
    const normalizedQuery = debounceQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      lastResultRef.current = people;

      return people;
    }

    const result = people.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );

    lastResultRef.current = result;

    return result;
  }, [debounceQuery, people]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      if (query !== previousQueryRef.current) {
        setDebounceQuery(query);
        previousQueryRef.current = query;
      }
    }, delay);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [query, delay]);

  const handleQueryChange = (
    inputEvent: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuery(inputEvent.target.value);
    onSelected(null);
  };

  const handleSuggestionClick = (
    eventSuggestion: React.MouseEvent<HTMLDivElement>,
  ) => {
    const personName = eventSuggestion.currentTarget.dataset.personName;

    if (personName) {
      setQuery(personName);
    }

    const selected = people.find(person => person.name === personName) || null;

    onSelected(selected);
    setIsDropdownOpen(false);
  };

  const handleInputFocus = () => {
    setIsDropdownOpen(true);
  };

  return (
    <>
      <div className={`dropdown ${isDropdownOpen ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            value={query}
            className="input"
            data-cy="search-input"
            onChange={handleQueryChange}
            onFocus={handleInputFocus}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(personItem => (
              <div
                key={personItem.name}
                className="dropdown-item"
                data-cy="suggestion-item"
                data-person-name={personItem.name}
                onClick={handleSuggestionClick}
              >
                <p
                  className={
                    personItem.sex === 'f' ? 'has-text-danger' : 'has-text-link'
                  }
                >
                  {personItem.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {debounceQuery && filteredPeople.length === 0 && (
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
    </>
  );
};
