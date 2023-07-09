import React from 'react';
import cn from 'classnames';

import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  onClick?: (person: Person) => void;
};

export const PeopleList: React.FC<Props> = ({
  people,
  onClick = () => {},
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length !== 0
          ? people.map(person => (
            <a
              key={person.slug}
              href="#/"
              className={cn('dropdown-item', {
                'has-text-link': person.sex === 'm',
                'has-text-danger': person.sex === 'f',
              })}
              onClick={(event) => {
                event.preventDefault();
                onClick(person);
              }}
            >
              <p
                className={cn({
                  'has-text-link': person.sex === 'm',
                  'has-text-danger': person.sex === 'f',
                })}
              >
                {person.name}
              </p>
            </a>
          ))
          : (
            <div className="dropdown-item">
              <p className="has-text-danger">
                No matching suggestions
              </p>
            </div>
          )}
      </div>
    </div>
  );
};
