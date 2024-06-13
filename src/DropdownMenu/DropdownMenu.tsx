import React from 'react';
import { DropdownItem } from '../DropdownItem';
import { Person } from '../types/Person';

interface Type {
  people: Person[];
  onSelect: (person: Person) => void;
}

export const DropdownMenu: React.FC<Type> = ({ people, onSelect }) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {people.map(person => (
          <DropdownItem person={person} onSelect={onSelect} key={person.name} />
        ))}
      </div>
    </div>
  );
};
