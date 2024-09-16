import React from 'react';
import cn from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  selectPerson: (person: Person) => void;
};
export const DropdownList: React.FC<Props> = React.memo(
  ({ people, selectPerson }) => {
    return (
      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {people.map(person => (
            <div
              className="dropdown-item is-clickable"
              data-cy="suggestion-item"
              key={person.slug}
              onClick={() => selectPerson(person)}
            >
              <p
                className={cn({
                  'has-text-link': person.sex === 'm',
                  'has-text-danger': person.sex === 'f',
                })}
              >
                {person.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  },
);
