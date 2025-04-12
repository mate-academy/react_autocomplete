import React, { useState, useMemo, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { PersonList } from '../PersonList/PersonList';
import { Person } from '../../types/Person';

interface SearchBarProps {
  people: Person[];
  onPersonSelected: (person: Person | null) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  people,
  onPersonSelected,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isDropDown, setIsDropDown] = useState(true);
  const trimmedQuery = appliedQuery.trim(); // Додано обрізання пробілів

  const debouncedSetQuery = useMemo(
    () => debounce((value: string) => setAppliedQuery(value), 300),
    [],
  );

  useEffect(() => {
    debouncedSetQuery(query);

    return () => debouncedSetQuery.cancel();
  }, [query, debouncedSetQuery]);

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          value={query}
          className="input"
          data-cy="search-input"
          onChange={event => {
            setQuery(event.target.value);
            onPersonSelected(null); // Очищаємо вибір при зміні запиту
            setIsDropDown(true);
          }}
        />
      </div>
      {isDropDown && (
        <PersonList
          people={people}
          query={trimmedQuery}
          onPersonSelect={person => {
            onPersonSelected(person);
            setQuery(person.name);
            setIsDropDown(false);
          }}
        />
      )}
    </div>
  );
};
