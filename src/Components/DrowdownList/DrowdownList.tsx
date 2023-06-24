import React from 'react';
import { Person } from '../../types/Person';
import { DropdownItem } from '../DropdownItem/DropdownItem';

interface Props {
  people: Person[];
  handlePersonSelect: (person: Person) => void;
}

export const DropdownList: React.FC<Props> = React.memo(
  ({ people, handlePersonSelect }) => {
    return (
      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {people.length !== 0
            ? people.map(person => (
              <DropdownItem
                key={person.slug}
                handlePersonSelect={handlePersonSelect}
                person={person}
              />
            )) : 'No selected person'}
        </div>
      </div>
    );
  },
);
