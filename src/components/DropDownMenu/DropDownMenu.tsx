import React from 'react';
import { Person } from '../../types/Person';
import { DropDownItem } from '../DropDownItem/DropDownItem';

type Props = {
  options: Person[];
  onSelect: (option: Person) => void;
};

export const DropDownMenu: React.FC<Props> = ({ options, onSelect }) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {options.map(option => (
          <DropDownItem option={option} key={option.slug} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
};
