import React, { memo } from 'react';
import cn from 'classnames';
import { Person } from '../../types/Person';

interface Props {
  person: Person;
  onSelected: (name: string) => void;
}

export const DropdownItem: React.FC<Props> = memo(({ person, onSelected }) => {
  const handlePersonOnClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const personName = event.currentTarget.textContent;

    if (!personName) {
      return;
    }

    onSelected(personName);
  };

  return (
    <a
      href="/"
      className={cn(
        'dropdown-item',
        {
          'has-text-link': person.sex === 'm',
          'has-text-danger': person.sex === 'f',
        },
      )}
      onClick={handlePersonOnClick}
    >
      {person.name}
    </a>
  );
});
