import React, { useState, useMemo } from 'react';
import { Person } from '../../types/Person';
import { useDebouncedValue } from '../../hooks/UsedeboncedValue';

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
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const appliedQuery = useDebouncedValue(query, delay);

  const filteredPeople = useMemo(() => {
    const normalizedQuery = appliedQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return people;
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  }, [people, appliedQuery]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    onSelected(null);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
  };

  const handleSuggestionClick = (person: Person) => {
    setQuery(person.name);
    onSelected(person);
    setIsFocused(false);
  };

  const showSuggestions = isFocused && filteredPeople.length > 0;
  const showNoMatchesMessage = isFocused && filteredPeople.length === 0;

  return (
    <>
      <div className={`dropdown ${showSuggestions ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        </div>

        {showSuggestions && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  key={person.slug}
                  data-cy="suggestion-item"
                  onMouseDown={() => handleSuggestionClick(person)}
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

      {showNoMatchesMessage && (
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
