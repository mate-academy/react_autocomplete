import React from 'react';
import { Person } from '../../types/Person';
import { DropdownItem } from './DropdownItem';

type Props = {
  visiblePeople: Person[];
  handlePersonClick: (person: Person) => void;
};

export const DropdownMenu: React.FC<Props> = React.memo(
  (
    {
      visiblePeople,
      handlePersonClick,
    },
  ) => {
    return (
      <div
        className="dropdown-menu"
        role="menu"
      >
        <ul className="dropdown-content">
          {
            visiblePeople.length > 0 ? (
              visiblePeople.map((person) => (
                <DropdownItem
                  key={person.slug}
                  person={person}
                  onPersonClick={handlePersonClick}
                />
              ))
            ) : (
              <li className="dropdown-item">
                No match found
              </li>
            )
          }
        </ul>
      </div>
    );
  },
);
