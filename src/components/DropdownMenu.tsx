import React from 'react';
import cn from 'classnames';
import { Person } from '../types/Person';

type Props = {
  visiblePeople: Person[],
  select: (person: Person) => void,
};

export const DropdownMenu: React.FC<Props> = React.memo(
  ({ visiblePeople, select }) => (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {visiblePeople.length === 0 && (
          <div className="dropdown-item">
            No matching suggestion
          </div>
        )}

        {visiblePeople.map((person) => (
          <button
            type="button"
            className="dropdown-item button-custom"
            onClick={() => select(person)}
          >
            <p
              key={person.slug}
              className={cn({
                'has-text-link': person.sex === 'm',
                'has-text-danger': person.sex === 'f',
              })}
            >
              {person.name}
            </p>

          </button>
        ))}

      </div>
    </div>
  ),
);
