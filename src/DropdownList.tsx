import React from 'react';
import { Person } from './types/Person';
import { DropdownItem } from './DropdownItem';

type Props = {
  people: Person[];
  onSelect: (person: Person) => void;
  selectedPerson: Person | null;
};

export const DropdownList: React.FC<Props> = ({
  people,
  onSelect,
  selectedPerson,
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.map((person) => (
          <DropdownItem
            person={person}
            key={person.name}
            onSelectItem={onSelect}
            isSelected={selectedPerson?.name === person.name}
          />
        ))}
      </div>
    </div>
  );
};
