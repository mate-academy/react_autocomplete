import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Person } from '../types/Person';
import { useDebounce } from '../hooks/useDebounce';
import { AutocompleteProps } from './types';

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  selectedPerson,
  onSelected,
  delayMs = 300,
  placeholder = 'Enter a part of the name',
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]); 

  const debouncedSearchQuery = useDebounce(searchQuery, delayMs); 
  const lastSearchQueryRef = useRef<string>('');

  const handleFocus = () => {
    setIsDropdownOpen(true);

    if (searchQuery.trim() === '') {
      setFilteredPeople(people);
      lastSearchQueryRef.current = '';
    }
  };

  const handleBlur = () => {
    window.setTimeout(() => setIsDropdownOpen(false), 100);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => { 
    const inputValue = event.target.value;
    setSearchQuery(inputValue);

    if (selectedPerson) {
      onSelected(null);
    }

    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
    }
  };

  const handleSelectPerson = (person: Person) => {
    setSearchQuery(person.name);
    onSelected(person);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    if (debouncedSearchQuery === lastSearchQueryRef.current) { 
      return;
    }

    lastSearchQueryRef.current = debouncedSearchQuery;

    const normalizedQuery = debouncedSearchQuery.trim().toLowerCase();

    if (normalizedQuery === '') {
      setFilteredPeople(isDropdownOpen ? people : []);
      return;
    }

    const matchingPeople = people.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );

    setFilteredPeople(matchingPeople);
  }, [debouncedSearchQuery, isDropdownOpen, people]);

  const shouldShowNoMatches = 
    isDropdownOpen &&
    debouncedSearchQuery.trim() !== '' &&
    filteredPeople.length === 0;

  return (
    <>
      <div className={cn('dropdown', { 'is-active': isDropdownOpen })}> {}
        <div className="dropdown-trigger">
          <input
            type="text"
            className="input"
            placeholder={placeholder}
            data-cy="search-input"
            value={searchQuery}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoComplete="off"
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                key={person.name}
                className="dropdown-item"
                data-cy="suggestion-item"
                onMouseDown={() => handleSelectPerson(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {shouldShowNoMatches && (
        <div
          className="notification is-danger is-light mt-3"
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
};
