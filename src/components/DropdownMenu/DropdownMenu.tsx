import React, { memo } from 'react';
import { Person } from '../../types/Person';
import { DropdownItem } from '../DropdownItem';

interface DropdownMenuProps {
  people: Person[];
  onSelected: (person: Person) => void;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = memo(({
  people,
  onSelected,
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length
          ? (
            people.map((person) => (
              <DropdownItem
                person={person}
                onSelected={onSelected}
                key={person.slug}
              />
            ))
          ) : (
            <span className="dropdown-item">
              No matching suggestions
            </span>
          )}
      </div>
    </div>
  );
});
