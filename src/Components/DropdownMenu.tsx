import React from 'react';
import cn from 'classnames';
import { Person } from '../types/Person';

type Props = {
  visiblePeople: Person[],
  onSelectPerson: (person: Person) => void,
};

export const DropdownMenu: React.FC<Props> = React.memo(
  ({ visiblePeople, onSelectPerson }) => {
    return (
      <div className="dropdown-content">
        {visiblePeople.length
          ? (visiblePeople.map(person => (
            <button
              type="button"
              className="dropdown-item button"
              key={person.slug}
              onClick={() => onSelectPerson(person)}
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
