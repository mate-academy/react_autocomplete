import React, { useCallback, useMemo, useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelected?: (person: Person | null) => void;
  delay?: number;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), [delay]);

  useEffect(() => {
    return () => {
      applyQuery.cancel();
    };
  }, [applyQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    if (event.target.value.trim() !== '' && event.target.value.length < 0) {
      applyQuery(event.target.value);
    }
  };

  const filteredNames = useMemo(() => {
    const q = appliedQuery.trim().toLowerCase();

    if (q === '' && isFocused) {
      return people;
    }

    if (q === '') {
      return [];
    }

    return people.filter(p => p.name.toLowerCase().includes(q));
  }, [appliedQuery, isFocused, people]);

  return (
    <div className={`dropdown ${isFocused ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-qa="search-input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>

      {isFocused && (
        <div className="dropdown-menu" role="menu" data-qa="suggestions-list">
          <div className="dropdown-content">
            {filteredNames.length > 0 ? (
              filteredNames.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-qa="suggestion-item"
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => {
                    setQuery(person.name);
                    onSelected?.(person);
                    setIsFocused(false);
                  }}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))
            ) : (
              <div
                className="
                    notification
                    is-danger
                    is-light
                    mt-3
                    is-align-self-flex-start
                    "
                role="alert"
                data-qa="no-suggestions-message"
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
