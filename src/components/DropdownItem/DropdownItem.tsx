import React, { memo } from 'react';
import cn from 'classnames';
import { Person } from '../../types/Person';

interface Props {
  person: Person;
  onSelected: () => void;
}

export const DropdownItem: React.FC<Props> = memo(({ person, onSelected }) => {
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
      onClick={onSelected}
    >
      {person.name}
    </a>
  );
});
