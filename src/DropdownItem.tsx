import React from 'react';
import cn from 'classnames';
import { Person } from './types/Person';

type Props = {
  person: Person
  onSelect: (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person
  ) => void;
};

export const DropdownItem: React.FC<Props> = ({ person, onSelect }) => (
  <div className="dropdown-item">
    <a
      href="/"
      className={cn('has-text-link', {
        'has-text-danger': person.sex === 'f',
        'has-text-link': person.sex === 'm',
      })}
      onClick={(e) => onSelect(e, person)}
    >
      {person.name}
    </a>
  </div>
);
