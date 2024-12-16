import React, { useState, useCallback } from 'react';
import { Person } from '../types/Person';
import { peopleFromServer } from '../data/people';

type DropdownProps = {
  query: string;
  filteredPeople: Person[];
  onQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPersonSelect: (person: Person) => void;
};

export const Dropdown: React.FC<DropdownProps> = ({
  query,
  filteredPeople,
  onQueryChange,
  onPersonSelect,
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const showPeople =
    isFocused && query === '' ? peopleFromServer : filteredPeople;

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={onQueryChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {showPeople.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.slug}
                onClick={() => onPersonSelect(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
