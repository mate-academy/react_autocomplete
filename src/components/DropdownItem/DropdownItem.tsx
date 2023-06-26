import React from 'react';
import classNames from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  person: Person,
  onSelected: (person: Person) => void
};

export const DropdownItem: React.FC<Props> = React.memo(
  ({ person, onSelected }) => {
    const { sex, name } = person;

    const handleClick = (event: React.MouseEvent) => {
      event.preventDefault();
      onSelected(person);
    };

    return (
      <a
        href="/"
        className={classNames('dropdown-item', {
          'has-text-link': sex === 'm',
          'has-text-danger': sex === 'f',
        })}
        onClick={handleClick}
      >
        {name}
      </a>
    );
  },
);
