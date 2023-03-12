import cn from 'classnames';
import React from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[],
  selectPerson: (person: Person) => void,
};

export const DropdownList: React.FC<Props> = React.memo(
  ({ people, selectPerson }) => {
    return (
      <div className="dropdown-content">
        {people.length > 0
          ? (people.map(person => (
            <button
              type="button"
              className="dropdown-item button"
              key={person.slug}
              onClick={() => selectPerson(person)}
            >
              <p
                className={cn(
                  { 'has-text-link': person.sex === 'm' },
                  { 'has-text-danger': person.sex === 'f' },
                )}
              >
                {person.name}
              </p>
            </button>
          )))
          : (
            <div className="dropdown-item">
              No matching suggestions
            </div>
          )}
      </div>
    );
  },
);
