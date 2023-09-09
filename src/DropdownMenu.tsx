import React from 'react';
import { Person } from './types/Person';
import { DropdownItem } from './DropdownItem';

type Props = {
  filteredPeople: Person[];
  onSelect: (person :Person) => void;
};

export const DropdownMenu: React.FC<Props> = ({
  filteredPeople,
  onSelect,
}) => (
  <div className="dropdown-menu" role="menu">
    <div className="dropdown-content">
      {filteredPeople.length
        ? (
          filteredPeople.map((person: Person) => (
            <DropdownItem
              person={person}
              onSelect={onSelect}
              key={person.slug}
            />
          ))
        )
        : (
          <div className="dropdown-item">
            <p>No matching suggestions</p>
          </div>
        )}
    </div>
  </div>
);
