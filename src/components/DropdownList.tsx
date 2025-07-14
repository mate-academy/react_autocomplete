import React from 'react';
import { Person } from '../types/Person';
import { DropdownItem } from './DropdownItem';

type Props = {
  people: Person[];
  onSelected: (id: string) => void;
};

export const DropdownList = React.memo(function DropdownList({
  people,
  onSelected,
}: Props) {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {people.map(person => (
          <DropdownItem
            person={person}
            key={person.slug}
            onSelected={onSelected}
          />
        ))}
      </div>
    </div>
  );
});
