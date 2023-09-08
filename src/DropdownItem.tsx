import React from 'react';
import cn from 'classnames';
import { Person } from './types/Person';

type Props = {
  person: Person,
  selectedPerson: Person | null,
  handlePersonClick: (person: Person) => void,
  onSelect: (person: Person) => void,
};

export const DropdownItem: React.FC<Props> = React.memo(
  ({
    person,
    onSelect,
    selectedPerson,
    handlePersonClick,
  }) => {
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
            type="button"
            className="selector"
            onClick={() => {
              onSelect(person);
              handlePersonClick(person);
            }}
          >
            {person.name}
          </button>
        </p>
      </div>
    );
  },
);
