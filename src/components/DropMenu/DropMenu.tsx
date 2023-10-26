import React from 'react';
import cn from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  visiblePeople: Person[],
  onSelected: (value: Person) => void;
};

export const DropMenu: React.FC<Props> = ({
  visiblePeople,
  onSelected,
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {visiblePeople.map(person => (
          <button
            key={person.slug}
            type="button"
            className={cn('dropdown-item', {
              'has-text-link': person.sex === 'm',
              'has-text-danger': person.sex === 'f',
            })}
            onClick={() => {
              onSelected(person);
            }}
            style={{ cursor: 'pointer' }}
          >
            {person.name}
          </button>
        ))}
      </div>
    </div>
  );
};
