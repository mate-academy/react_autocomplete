import React from 'react';
import classNames from 'classnames';

import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelected: (newPerson: Person) => void;
};

export const DropdownMenu: React.FC<Props> = React.memo(({
  people,
  onSelected,
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.map(person => (
          <div
            className="dropdown-item"
            key={person.slug}
          >
            <a
              href="1"
              className={classNames({
                'has-text-link': person.sex === 'm',
                'has-text-danger': person.sex === 'f',
              })}
              onClick={(event) => {
                event.preventDefault();
                onSelected(person);
              }}
            >
              {person.name}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
});
