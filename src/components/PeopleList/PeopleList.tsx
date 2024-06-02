import React from 'react';
import cn from 'classnames';

import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  activateTitle: (person: Person) => () => void;
};

export const PeopleList: React.FC<Props> = React.memo(
  ({ people, activateTitle }) => (
    <div
      className="dropdown-menu"
      id="dropdown-menu"
      role="menu"
      data-cy="suggestions-list"
    >
      <div className="dropdown-content">
        {people.map(person => (
          <a
            key={person.name}
            className="dropdown-item"
            data-cy="suggestion-item"
            onClick={activateTitle(person)}
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
        ))}
      </div>
    </div>
  ),
);
