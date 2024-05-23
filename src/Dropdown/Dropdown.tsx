import React, { useState } from 'react';
import { Person } from '../types/Person';
import { DropdownMenu } from '../DropdownMenu';

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

  const handleBlur = () => {
    setTimeout(() => {
      setShowMenu(false);
    }, 20);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={partText}
          onChange={queryChange}
          onFocus={() => setShowMenu(true)}
          onBlur={handleBlur}
        />
      </div>

      {showMenu && <DropdownMenu people={people} onSelect={onSelect} />}
    </div>
  );
};
