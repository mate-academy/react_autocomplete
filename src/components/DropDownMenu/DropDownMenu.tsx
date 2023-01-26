import React from 'react';
import { PersonType } from '../../types/PersonType';
import { DropDownItem } from '../DropDownItem';

type Props = {
  list: PersonType[];
  onSelect: (person: PersonType) => void;
};

export const DropDownMenu: React.FC<Props> = React.memo(
  ({ list, onSelect }) => (
    <ul className="dropdown-content">
      {(list.length > 0)
        ? list.map((person) => (
          <li
            className="dropdown-item"
            key={person.slug}
          >
            <DropDownItem item={person} onSelect={onSelect} />
          </li>
        ))
        : <p>No matching suggestions</p>}
    </ul>
  ),
);
