import { DropdownMenu } from '../dropdownMenu/DropdownMenu';
import React, { useRef, useMemo, useState, useEffect, FC } from 'react';
import { Person } from '../../types/Person';
import debounce from 'lodash.debounce';

type Props = {
  onQueryChange: React.Dispatch<React.SetStateAction<string>>;
  onPersonSelect: React.Dispatch<React.SetStateAction<Person | null>>;
  people: Person[];
  debounceDelay: number;
};

export const Dropdown: FC<Props> = ({
  onPersonSelect,
  people,
  onQueryChange,
  debounceDelay,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [isDisplayedDropdown, setIsDisplayedDropdown] = useState(false);
  const setDelayedQuery = useMemo(
    () => debounce(onQueryChange, debounceDelay),
    [debounceDelay, onQueryChange],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDisplayedDropdown && !dropdownRef.current?.contains(event.target)) {
        setIsDisplayedDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
  }, [isDisplayedDropdown]);

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={event => {
            setQuery(event.target.value);
            setDelayedQuery(event.target.value);
            onPersonSelect(null);
          }}
          onFocus={() => {
            setIsDisplayedDropdown(true);
          }}
        />
      </div>

      {people.length !== 0 && isDisplayedDropdown && (
        <DropdownMenu
          people={people}
          dropdownRef={dropdownRef}
          setSelectedPerson={onPersonSelect}
          setDisplayedDropdown={setIsDisplayedDropdown}
          setQuery={setQuery}
        />
      )}
    </div>
  );
};
