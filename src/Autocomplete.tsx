import React, { useState, useMemo, useEffect, useRef } from 'react';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';

interface AutocompleteProps {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const lastProcessedRef = useRef<string>('');

  const applyQuery = useMemo(
    () =>
      debounce((value: string) => {
        if (lastProcessedRef.current === value) {
          return;
        }

        lastProcessedRef.current = value;
        setAppliedQuery(value);
      }, delay),
    [delay],
  );

  useEffect(() => {
    return () => applyQuery.cancel();
  }, [applyQuery]);

  useEffect(() => {
    if (query.trim() === '') {
      setAppliedQuery('');
      lastProcessedRef.current = '';
    }
  }, [query]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const trimmed = value.trim();

    setQuery(value);
    applyQuery(trimmed || '');
    onSelected(null);
    setIsDropdownOpen(true);
  };

  const filteredPeople = useMemo(() => {
    if (appliedQuery === '') {
      return people;
    }

    return people.filter(p =>
      p.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery, people]);

  const handleSuggestionClick = (person: Person) => {
    setQuery(person.name);
    setIsDropdownOpen(false);
    onSelected(person);
  };

  return (
    <div className={`dropdown ${isDropdownOpen ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          className="input"
          placeholder="Enter a part of the name"
          value={query}
          onChange={handleInput}
          onFocus={() => setIsDropdownOpen(true)}
          data-qa="search-input"
          data-cy="search-input"
        />
      </div>

      <div
        className="dropdown-menu"
        role="menu"
        data-qa="suggestions-list"
        data-cy="suggestions-list"
      >
        <div className="dropdown-content">
          {filteredPeople.length > 0 ? (
            filteredPeople.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                data-qa="suggestion-item"
                data-cy="suggestion-item"
                onClick={() => handleSuggestionClick(person)}
              >
                <p
                  className={
                    person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                  }
                >
                  {person.name}
                </p>
              </div>
            ))
          ) : (
            <div
              className="notification is-danger is-light mt-3"
              data-qa="no-suggestions-message"
              data-cy="no-suggestions-message"
            >
              No matching suggestions
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
