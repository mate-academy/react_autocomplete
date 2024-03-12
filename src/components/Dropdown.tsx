import React, { useState, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
};

export const Dropdown: React.FC<Props> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [isDropdownActive, setIsDropdownActive] = useState(false);

  const filteredPeople = useMemo(() => {
    const normalisedQuery = query.toLowerCase().trim();

    return people.filter(person => {
      const normalisedPerson = person.name.toLowerCase();

      return normalisedPerson.includes(normalisedQuery);
    });
  }, [query, people]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    onSelected(null);
  };

  const handleInputFocus = () => {
    debounce(() => setIsDropdownActive(true), delay)();
  };

  const handleSuggestionClick = (person: Person) => {
    setQuery(person.name);
    onSelected(person);
    setIsDropdownActive(false);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        {isDropdownActive && (
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.name}
                role="menuitem"
                tabIndex={0}
                onClick={() => handleSuggestionClick(person)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSuggestionClick(person);
                  }
                }}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
            {!filteredPeople.length && (
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
        )}
      </div>
    </div>
  );
};
