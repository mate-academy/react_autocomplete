import React from 'react';
import { Person } from '../../types/Person';
import { DropdownItem } from '../DropdownItem/DropdownItem';

interface Props {
  persons: Person[];
  onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const DropdownMenu: React.FC<Props> = ({ persons, onClick }) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {
          persons.length
            ? persons.map(person => (
              <DropdownItem
                person={person}
                onClick={onClick}
              />
            ))
            : (
              <span className="dropdown-item">
                No matching suggestions
              </span>
            )
        }
      </div>
    </div>
  );
};
