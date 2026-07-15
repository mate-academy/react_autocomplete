import React, { useEffect, useMemo, useState } from 'react';
import './Autocomplete.scss';
import debounce from 'lodash.debounce';
import { Person } from '../../types/Person';

interface Props {
  people: Person[];
  delay?: number;
  onSelected?: (person: Person | null) => void;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const debouncedSetQuery = useMemo(() => {
    return debounce((value: string) => setDebouncedQuery(value), delay);
  }, [delay]);

  useEffect(() => {
    debouncedSetQuery(query);
  }, [debouncedSetQuery, query]);

  const filteredPeople = useMemo(() => {
    const trimmed = debouncedQuery.trim();

    if (!trimmed) {
      return people;
    }

    return people.filter(person => {
      return person.name.toLowerCase().includes(trimmed.toLowerCase());
    });
  }, [people, debouncedQuery]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);
    if (value !== query) {
      onSelected?.(null);
    }
  };

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    onSelected?.(person);
    setIsFocused(false);
  };

  const showDropdown =
    isFocused && (query.trim() === '' || filteredPeople.length > 0);

  const showNoResult =
    isFocused && query.trim() !== '' && filteredPeople.length === 0;

  return (
    <div className="wrapper">
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            data-cy="search-input"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="input"
          />
        </div>

        {showDropdown && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  key={person.name}
                  className="dropdown-item is-hovered"
                  data-cy="suggestion-item"
                  style={{ cursor: 'pointer' }}
                  onMouseDown={() => handleSelect(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showNoResult && (
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
