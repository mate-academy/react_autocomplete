import React from 'react';
import { Person } from '../../types/Person';
import { DropdownItem } from '../DropdownItem/DropdownItem';
import { v4 as uuidv4 } from 'uuid';

type DropdownMenuProps = {
  handleSelectPerson: (people: Person) => void;
  shouldShowContent: boolean;
  filteredPeople: Person[];
};

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  handleSelectPerson,
  shouldShowContent,
  filteredPeople,
}) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      {shouldShowContent && (
        <div className="dropdown-content">
          {filteredPeople.map(people => (
            <DropdownItem
              key={uuidv4()}
              people={people}
              handleSelectPerson={handleSelectPerson}
            />
          ))}
        </div>
      )}
    </div>
  );
};
