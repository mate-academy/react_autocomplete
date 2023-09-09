import React from 'react';
import cn from 'classnames';
import { Person } from './types/Person';

type Props = {
  person: Person
  onSelect: (person: Person) => void;
};

export const DropdownItem: React.FC<Props> = ({ person, onSelect }) => (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
  <div
    className="dropdown-item"
    style={{ cursor: 'pointer' }}
    onClick={() => onSelect(person)}
  >
    <p
      className={cn('has-text-link', {
        'has-text-danger': person.sex === 'f',
        'has-text-link': person.sex === 'm',
      })}
    >
      {person.name}
    </p>
  </div>
);
