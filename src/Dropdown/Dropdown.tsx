import React, { useState, useRef, useEffect } from 'react';
import { Person } from '../types/Person';
import { DropdownMenu } from '../DropdownMenu';
import cn from 'classnames';

interface Type {
  people: Person[];
  queryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  partText: string;
  onSelect: (person: Person) => void;
}

export const Dropdown: React.FC<Type> = ({
  people,
  queryChange,
  partText,
  onSelect,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

      <DropdownMenu people={people} onSelect={handleSelect} />
    </div>
  );
};
