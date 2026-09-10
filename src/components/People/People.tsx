import cn from 'classnames';
import React from 'react';
import { Person } from '../../types/Person';

interface Props {
  people: Person[];
  onSelected: (person: Person) => void;
}

enum PersonSex {
  Female = 'f',
  Male = 'm',
}

export const People: React.FC<Props> = React.memo(({ people, onSelected }) => (
  <div
    className="dropdown-menu"
    role="menu"
    data-cy="suggestions-list"
    onMouseDown={event => event.preventDefault()}
  >
    <div className="dropdown-content">
      {people.map(person => (
        <div
          className="dropdown-item"
          data-cy="suggestion-item"
          key={person.slug}
          onClick={() => {
            onSelected(person);
          }}
        >
          <p
            className={cn(
              { 'has-text-link': person.sex === PersonSex.Male },
              { 'has-text-danger': person.sex === PersonSex.Female },
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
