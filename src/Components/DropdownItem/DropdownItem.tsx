import React from 'react';
import cn from 'classnames';
import { Person } from '../../types/Person';

interface Props {
  person: Person;
  handlePersonSelect: (person: Person) => void;
}

export const DropdownItem: React.FC<Props> = (
  { person, handlePersonSelect },
) => {
  const { slug, sex, name } = person;

  return (
    <div
      className="dropdown-item"
      key={slug}
    >
      <a
        href="/"
        className={cn({
          'has-text-link': sex === 'm',
          'has-text-danger': sex === 'f',
        })}
        onClick={(e) => {
          e.preventDefault();

          handlePersonSelect(person);
        }}
      >
        {name}
      </a>
    </div>
  );
};
