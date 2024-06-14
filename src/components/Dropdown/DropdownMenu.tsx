import React, { useContext } from 'react';
import { DropdownItem } from './DropdownItem';
import { Context, isPartInText } from './Context';

export const DropdownMenu: React.FC = () => {
  const { people, personName } = useContext(Context);

  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {people
          .filter(person => isPartInText(person.name, personName))
          .map(person => (
            <DropdownItem key={person.slug} person={person} />
          ))}
      </div>
    </div>
  );
};
