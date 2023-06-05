import React, { memo } from 'react';
import { DropdownItem } from '../DropdownItem';
import { Person } from '../../types/Person';

interface Props {
  people: Person[];
  onSelected: () => void;
}

export const DropdownMenu: React.FC<Props> = memo(({
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
                key={person.slug}
                person={person}
                onSelected={onSelected}
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
