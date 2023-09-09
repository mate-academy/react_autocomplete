import React from 'react';

import { Person } from '../../types/Person';
import { DropdownPerson } from '../DropdownPerson';

type Props = {
  filteredPeople: Person[],
  onSelect: (person: Person) => void,
};

export const DropdownList: React.FC<Props> = ({
  filteredPeople,
  onSelect,
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {filteredPeople.length
          ? (
            filteredPeople.map(person => (
              <DropdownPerson
                key={person.slug}
                person={person}
                onSelect={onSelect}
              />
            )))
          : (
            <div className="dropdown-item">
              <p>No matching suggestions</p>
            </div>
          )}
      </div>
    </div>
  );
};
