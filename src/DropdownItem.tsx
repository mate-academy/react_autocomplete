import React from 'react';
import cn from 'classnames';
import { Person } from './types/Person';

type Props = {
  person: Person
  onSelected: (person: Person) => void;
};

export const DropdownItem:React.FC<Props> = React.memo(
  ({ person, onSelected }) => (
    <button
      type="button"
      className="dropdown-item button-custom"
      onClick={() => onSelected(person)}
    >
      <p
        className={cn({
          'has-text-link': person.sex === 'm',
          'has-text-danger': person.sex === 'f',
        })}
      >
        {person.name}
      </p>
    </button>
  ),
);
