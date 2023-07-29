import React from 'react';
import { Person } from '../types/Person';
import { DropdownItem } from './DropDownItem';

export interface Props {
  people: Person[];
  onSelected: (person: Person) => void;
}

export const DropdownMenu: React.FC<Props> = ({ people, onSelected }) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        <DropdownItem
          people={people}
          onSelected={onSelected}
        />
      </div>
    </div>
  );
};
