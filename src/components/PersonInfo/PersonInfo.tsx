import React from 'react';
import cn from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  person: Person;
  onSelect: (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person
  ) => void;
};

enum Sex {
  Male = 'm',
  Female = 'f',
}

export const PersonInfo: React.FC<Props> = ({ person, onSelect }) => {
  const { sex, name, slug } = person;

  return (
    <div className="dropdown-item" key={slug}>
      <a href="/" onClick={(event) => onSelect(event, person)}>
        <p className={cn(
          sex === Sex.Male
            ? 'has-text-link'
            : 'has-text-danger',
        )}
        >
          {name}
        </p>
      </a>
    </div>
  );
};
