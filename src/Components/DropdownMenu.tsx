import React from 'react';
import { Person } from '../types/Person';
import { DropdownItem } from './DropdownItem';

type Props = {
  filteredPeople: Person[];
  onSelectPerson: (person :Person) => void;
};

export const DropdownMenu: React.FC<Props> = ({
  filteredPeople,
  onSelectPerson,
}) => (
  <div className="dropdown-menu" role="menu">
    <div className="dropdown-content">
      {filteredPeople.length
        ? (
          filteredPeople.map((person: Person) => (
            <DropdownItem
              person={person}
              onSelectPerson={onSelectPerson}
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
