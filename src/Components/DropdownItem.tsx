import React, { useCallback } from 'react';
import cn from 'classnames';
import { Person } from '../types/Person';

const PERSON_SEX_MAN = 'm';
const PERSON_SEX_WOMAN = 'f';

type Props = {
  person: Person
  onSelectPerson: (person: Person) => void;
};

export const DropdownItem: React.FC<Props> = ({ person, onSelectPerson }) => {
  const handleItemClick = useCallback(() => {
    onSelectPerson(person);
  }, [onSelectPerson, person]);

  const handleItemKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onSelectPerson(person);
    }
  }, [onSelectPerson, person]);

  return (
    <div
      className="dropdown-item"
      onClick={handleItemClick}
      onKeyDown={handleItemKeyDown}
      role="option"
      tabIndex={0}
      aria-selected={false}
    >
      <p
        className={cn('has-text-link', {
          'has-text-danger': person.sex === PERSON_SEX_WOMAN,
          'has-text-link': person.sex === PERSON_SEX_MAN,
        })}
      >
        {person.name}
      </p>
    </div>
  );
};
