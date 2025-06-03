import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Person } from '../types/Person';
import { PersonList } from './PersonList';
import debounce from 'lodash.debounce';

type SearchBarProps = {
  people: Person[];
  onPersonSelected: (person: Person | null) => void;
};

export const SearchBar: React.FC<SearchBarProps> = ({
  people,
  onPersonSelected,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isDropDown, setIsDropDown] = useState(false);

  const trimmedQuery = appliedQuery.trim();

  const debouncedSetQuery = useRef(
    debounce((value: string) => {
      setAppliedQuery(value);
    }, 300),
  );

  useEffect(() => {
    const funcDebounce = debouncedSetQuery.current;

    funcDebounce(query);

    return () => {
      funcDebounce.cancel();
    };
  }, [query]);

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={ev => {
            setQuery(ev.target.value);
            onPersonSelected(null);
          }}
          onFocus={() => {
            setIsDropDown(true);
          }}
        />
      </div>

      {isDropDown && (
        <PersonList
          trimmedQuery={trimmedQuery}
          people={people}
          onPersonSelected={onPersonSelected}
        />
      )}
    </div>
  );
};
