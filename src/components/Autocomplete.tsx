import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Person } from '../types/Person';
import classNames from 'classnames';

interface AutocompleteProps {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [isDropdownActive, setIsDropdownActive] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const filterPeople = useCallback(
    (query: string) => {
      const trimmedQuery = query.trim();

      if (!trimmedQuery) {
        setSuggestions(people);

        return;
      }

      const lowercaseQuery = trimmedQuery.toLowerCase();
      const filteredPeople = people.filter(person =>
        person.name.toLowerCase().includes(lowercaseQuery),
      );

      setSuggestions(filteredPeople);
    },
    [people],
  );

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      filterPeople(searchText);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchText, delay, filterPeople]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFocus = () => {
    setIsDropdownActive(true);

    if (!searchText.trim()) {
      setSuggestions(people);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchText = e.target.value;

    setSearchText(newSearchText);
    setIsDropdownActive(true);
    onSelected(null);
  };

  const handleSelectPerson = (person: Person) => {
    setSearchText(person.name);
    setIsDropdownActive(false);
    onSelected(person);
  };

  const hasSuggestions = suggestions.length > 0;

  return (
    <div
      ref={dropdownRef}
      className={classNames('dropdown', { 'is-active': isDropdownActive })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={searchText}
          onChange={handleInputChange}
          onFocus={handleFocus}
        />
      </div>

      {isDropdownActive && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {hasSuggestions ? (
              suggestions.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => handleSelectPerson(person)}
                >
                  <p
                    className={classNames({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex !== 'm',
                    })}
                  >
                    {person.name}
                  </p>
                </div>
              ))
            ) : (
              <div
                className="notification is-danger is-light mt-3 mb-0"
                role="alert"
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
