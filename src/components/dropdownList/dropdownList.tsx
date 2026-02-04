import React from 'react';
import { Person } from '../../types/Person';
import { DropdownItem } from '../dropdownItem';

type DropdownListProps = {
  suggestions: Person[];
  onSelect: (person: Person) => void;
};

export const DropdownList: React.FC<DropdownListProps> = ({
  suggestions,
  onSelect,
}) => {
  return (
    <div className="dropdown-list" data-cy="suggestions-list">
      {suggestions.map(person => (
        <DropdownItem key={person.name} person={person} onSelect={onSelect} />
      ))}
    </div>
  );
};
