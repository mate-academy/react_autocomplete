import React from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  person: Person;
  onClick: (person: Person) => void;
};

export const PersonInfo: React.FC<Props> = ({ person, onClick }) => {
  const itemClass = classNames('dropdown-item', {
    'has-text-link': person.sex === 'm',
    'has-text-danger': person.sex === 'f',
  });

  return (
    <a
      href="#"
      className={itemClass}
      data-cy="suggestion-item"
      onClick={e => {
        e.preventDefault();
        onClick(person);
      }}
    >
      {person.name}
    </a>
  );
};
