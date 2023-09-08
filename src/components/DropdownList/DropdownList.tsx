import React from 'react';

import { Person } from '../../types/Person';
import { DropdownPerson } from '../DropdownPerson';

type Props = {
  filteredPeople: Person[],
  setSelectedPerson: (person: Person) => void,
};

export const DropdownList: React.FC<Props> = ({
  filteredPeople,
  setSelectedPerson,
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
                setSelectedPerson={setSelectedPerson}
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
