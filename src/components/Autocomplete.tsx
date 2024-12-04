import { useEffect, useRef, useState } from 'react';
import { Person } from '../types/Person';
/* eslint-disable prettier/prettier */
/* eslint-disable max-len */

interface AutocompleteProps {
  people: Person[];
  onSelected: (person: Person | null) => void;
  debounceDelay: number;
}

export const Autocomplete = ({
  people,
  onSelected,
  debounceDelay,
}: AutocompleteProps) => {
  const [searchInput, setSearchInput] = useState('');
  const [isSearchInputFocus, setIsSearchInputFocus] = useState(false);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      const result = searchInput
        ? people.filter(person =>
          person.name.toLowerCase().includes(searchInput.toLowerCase()),
        )
        : people;

      setFilteredPeople(result);
    }, debounceDelay);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [searchInput, debounceDelay, people]);

  useEffect(() => {
    const handleClickOutsideDropdown = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsSearchInputFocus(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideDropdown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDropdown);
    };
  }, []);

  return (
    <div className="dropdown is-active" ref={dropdownRef}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={searchInput}
          onChange={event => {
            setSearchInput(event.target.value);
            onSelected(null);
          }}
          onFocus={() => {
            setIsSearchInputFocus(true);
          }}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        {isSearchInputFocus && filteredPeople.length > 0 ? (
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => {
                  onSelected(person);
                  setIsSearchInputFocus(false);
                }}
              >
                <p
                  className={`${
                    person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                  }`}
                >
                  {person.name}
                </p>
              </div>
            ))}
          </div>
        ) : (
          searchInput && (
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
          )
        )}
      </div>
    </div>
  );
};
