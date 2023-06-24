import React, { memo } from 'react';
import { Person } from '../../types/Person';

interface DropdownItemProps {
  person: Person;
  onSelected: (person: Person) => void;
}

export const DropdownItem: React.FC<DropdownItemProps> = memo(({
  person,
  onSelected,
}) => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    onSelected(person);
  };

  const { name } = person;

  return (
    <div className="dropdown-item">
      <a
        href="/"
        className="has-text-link"
        onClick={handleClick}
      >
        {name}
      </a>
    </div>
  );
});
