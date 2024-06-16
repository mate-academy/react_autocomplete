import React from 'react';
import { DropdownItem } from './DropdownItem';
import { isPartInText, useDropdownPeople } from './Context';

export const DropdownMenu = React.memo(() => {
  const { people, personName } = useDropdownPeople();

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
});
