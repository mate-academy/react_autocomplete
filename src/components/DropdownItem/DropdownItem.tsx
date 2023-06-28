import React from 'react';
import cn from 'classnames';
import { Person } from '../../types/Person';

interface Props {
  person: Person;
  onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const DropdownItem: React.FC<Props> = ({ person, onClick }) => {
  const {
    slug,
    sex,
    name,
  } = person;

  return (
    <a
      href="."
      className="dropdown-item"
      onClick={onClick}
      key={slug}
    >
      <p
        className={cn({
          'has-text-link': sex === 'm',
          'has-text-danger': sex === 'f',
        })}
      >
        {name}
      </p>
    </a>
  );
};
