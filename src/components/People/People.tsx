import cn from 'classnames';
import React from 'react';
import { Person } from '../../types/Person';

interface Props {
  people: Person[];
}

export const People: React.FC<Props> = React.memo(({ people }) => (
  <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
    <div className="dropdown-content">
      {people.map(person => (
        <div
          className="dropdown-item"
          data-cy="suggestion-item"
          key={person.slug}
        >
          <p
            className={cn(
              { 'has-text-link': person.sex === 'm' },
              { 'has-text-danger': person.sex === 'f' },
            )}
          >
            {person.name}
          </p>
        </div>
      ))}
    </div>
  </div>
));

People.displayName = 'People';
