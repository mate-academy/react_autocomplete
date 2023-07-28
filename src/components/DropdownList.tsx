import cn from 'classnames';
import React from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[],
  onSelect: (person: Person) => void,
  isFocused: boolean,
};

export const DropdownList: React.FC<Props> = React.memo(
  ({
    people,
    onSelect,
    isFocused
  }) => {
    return (
      <div className="dropdown-content">
        {people.length && isFocused ? (
          people.map(person => (
            <button
              type="button"
              className="dropdown-item button"
              key={person.slug}
              onMouseDown={() => onSelect(person)}
            >
              <p
                className={cn({
                  'has-text-link': person.sex === 'm',
                  'has-text-danger': person.sex === 'f',
                })}
              >
                {person.name}
              </p>
            </button>
          ))
        ) : (
          <div className="dropdown-item">
            No matching suggestions
          </div>
        )}
      </div>
    );
  },
);
