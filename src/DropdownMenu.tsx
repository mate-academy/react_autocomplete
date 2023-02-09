/* eslint-disable no-console */
import React from 'react';
import { Person } from './types/Person';
import { DropdownItem } from './DropdownItem';

type Props = {
  visiblePeople: Person[]
  onSelect: (person: Person) => void;
};
export const DropdownMenu:React.FC<Props> = React.memo(
  ({ visiblePeople, onSelect }) => (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {visiblePeople.length === 0 ? (
          <div className="dropdown-item">
            No matching suggestions
          </div>
        ) : (
          visiblePeople.map(person => (
            <DropdownItem
              key={person.slug}
              person={person}
              onSelected={onSelect}
            />
          ))
        )}
      </div>
    </div>
  ),
);
