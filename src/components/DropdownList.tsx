import React from 'react';
import { Person } from '../types/Person';
import { DropdownItem } from './DropdownItem';

type Props = {
  visiblePersons: Person[],
  onSelected: (person: Person) => void,
};

export const DropdownList: React.FC<Props> = React.memo(({
  visiblePersons,
  onSelected,
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {
          !visiblePersons.length ? (
            <div className="dropdown-item">
              <p className="notification is-info">No matching suggestions</p>
            </div>
          )
            : (
              visiblePersons.map(person => (
                <DropdownItem
                  key={person.slug}
                  person={person}
                  onSelected={onSelected}
                />
              ))
            )
        }
      </div>
    </div>
  );
});
