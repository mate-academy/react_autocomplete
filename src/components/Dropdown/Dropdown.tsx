import React from 'react';
import cn from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  onSelect: (person: Person) => void;
};

export const Dropdown: React.FC<Props> = React.memo((({ people, onSelect }) => (
  <div className="dropdown-menu" role="menu">
    <div className="dropdown-content">
      {people.length ? people.map((person: Person) => (
        <a
          href="."
          className="dropdown-item"
          key={person.slug}
          onClick={() => onSelect(person)}
        >
          <p
            className={cn('has-text-link', {
              'has-text-danger': person.sex === 'f',
              'has-text-link': person.sex === 'm',
            })}
          >
            {person.name}
          </p>
        </a>
      )) : (
        <div>
          No matching suggestions
        </div>
      )}
    </div>
  </div>
)));
