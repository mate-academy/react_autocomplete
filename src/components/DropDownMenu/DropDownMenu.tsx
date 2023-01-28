import React from 'react';
import { PersonType } from '../../types/PersonType';
import { DropDownItem } from '../DropDownItem';

type Props = {
  list: PersonType[];
  onSelect: (person: PersonType) => void;
};

export const DropDownMenu: React.FC<Props> = React.memo(
  ({ list, onSelect }) => (
    <div className="dropdown-menu" role="menu">
      <ul className="dropdown-content">
        {list.length
          ? list.map((person) => (
            <DropDownItem
              item={person}
              onSelect={onSelect}
              key={person.slug}
            />
          ))
          : <p>No matching suggestions</p>}
      </ul>
    </div>
  ),
);
