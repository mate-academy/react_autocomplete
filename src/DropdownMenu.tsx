import React from 'react';
import { Person } from './types/Person';
import { DropdownItem } from './DropdownItem';

type Props = {
  filteredPeople: Person[],
  selectedPerson: Person | null,
  handlePersonClick: (person: Person) => void,
  onSelect: (person: Person) => void,
};

export const DropdownMenu: React.FC<Props> = React.memo(
  ({
    filteredPeople,
    onSelect,
    selectedPerson,
    handlePersonClick,
  }) => {
    return (
      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPeople.length ? (
            filteredPeople.map(person => (
              <DropdownItem
                person={person}
                selectedPerson={selectedPerson}
                key={person.slug}
                onSelect={onSelect}
                handlePersonClick={handlePersonClick}
              />
            ))
          ) : (
            <p className="dropdown-item">No matching suggestions</p>
          )}
        </div>
      </div>
    );
  },
);
