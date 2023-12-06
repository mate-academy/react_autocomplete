import React from 'react';
import cn from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  onClick: (person: Person) => void;
};

export const People: React.FC<Props> = ({
  people,
  onClick,
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.map(person => (
          <a
            href={`/#${person.slug}`}
            className={cn('dropdown-item', {
              'has-text-danger': person.sex === 'f',
              'has-text-link': person.sex === 'm',
            })}
            key={person.slug}
            onClick={() => onClick(person)}
          >
            {person.name}
          </a>
        ))}
      </div>
    </div>
  );
};
