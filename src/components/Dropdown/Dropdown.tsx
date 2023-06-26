import React from 'react';
import { Person } from '../../types/Person';
import { DropdownItem } from '../DropdownItem/DropdownItem';

type Props = {
  persons: Person[],
  onSelected: (person: Person) => void
};

export const Dropdown: React.FC<Props> = React.memo(
  ({ persons, onSelected }) => {
    return (
      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {persons.length
            ? (
              persons.map(person => (
                <DropdownItem
                  person={person}
                  onSelected={onSelected}
                  key={person.slug}
                />
              )))
            : (
              <p className="dropdown-item">No matching suggestions</p>
            )}
        </div>
      </div>
    );
  },
);
