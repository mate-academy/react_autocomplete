import React from 'react';
import cn from 'classnames';
import { Person } from './types/Person';

type Props = {
  person: Person,
  selectedPerson: Person | null,
  onSelect: (person: Person) => void,
};

export const DropdownItem: React.FC<Props> = React.memo(
  ({ person, onSelect, selectedPerson }) => {
    return (
      <div
        className={cn('dropdown-item',
          {
            'has-background-link-light':
              selectedPerson?.slug === person.slug,
          })}
        key={person.slug}
      >
        <p
          className={cn({
            'has-text-link': person.sex === 'm',
            'has-text-danger': person.sex === 'f',
          })}
        >
          <button
            style={{ all: 'unset', width: '100%' }}
            type="button"
            className="selector"
            onClick={() => onSelect(person)}
          >
            {person.name}
          </button>
        </p>
      </div>
    );
  },
);
