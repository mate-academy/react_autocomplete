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

export const PeopleInfo: React.FC<Props> = ({ person, onSelect }) => {
  const { sex, name, slug } = person;

  return (
    <div
      className="dropdown-item"
      key={slug}
    >
      <a
        href="/"
        onClick={(event) => onSelect(event, person)}
      >
        <p className={cn(sex === 'm' ? 'has-text-link' : 'has-text-danger')}>
          {name}
        </p>
      </a>
    </div>
  );
};
