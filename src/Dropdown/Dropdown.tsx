import React, { useState, useRef, useEffect } from 'react';
import { Person } from '../types/Person';
import { DropdownMenu } from '../DropdownMenu';
import cn from 'classnames';

interface Type {
  people: Person[];
  queryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  partText: string;
  onSelect: (person: Person) => void;
  noSugAlert: string | boolean;
}

export const Dropdown: React.FC<Type> = ({
  people,
  queryChange,
  partText,
  onSelect,
  noSugAlert,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timerId = useRef(0);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (person: Person) => {
    onSelect(person);
    setShowMenu(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    queryChange(event);
    setShowMenu(false);

    timerId.current = window.setTimeout(() => {
      setShowMenu(true);
    }, 300);
  };

  return (
    <div
      className={cn('dropdown', {
        'is-active': showMenu,
      })}
      ref={dropdownRef}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={partText}
          onChange={handleInputChange}
          onFocus={() => setShowMenu(true)}
        />
      </div>

      {noSugAlert || <DropdownMenu people={people} onSelect={handleSelect} />}
    </div>
  );
};
