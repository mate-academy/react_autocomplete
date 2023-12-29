import React from 'react';

import cn from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  person: Person;
  onSelect: (
    person: Person
  ) => void;
};

export const PeopleInfo: React.FC<Props> = ({
  person,
  onSelect = () => {},
}) => {
  const { sex, name } = person;

  return (
    <div className="dropdown-item">
      <a
        href="/"
        onClick={(event) => {
          event.preventDefault();
          onSelect(person);
        }}
      >
        <p className={cn(sex === 'm' ? 'has-text-link' : 'has-text-danger')}>
          {name}
        </p>
      </a>
    </div>
  );
};
