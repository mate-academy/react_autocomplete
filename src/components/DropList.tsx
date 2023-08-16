import cn from 'classnames';
import React from 'react';
import { Person } from '../types/Person';

type Props = {
  onSelected: (person: Person) => void
  visiblePeople: Person[]
};

export const DropList: React.FC<Props> = React.memo(
  ({ onSelected, visiblePeople }) => {
    return (

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {visiblePeople.length
            ? (
              visiblePeople.map((person) => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                <div
                  className="dropdown-item"
                  key={person.slug}
                  onClick={() => onSelected(person)}
                >
                  <p
                    className={cn('suggestion-link', {
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                  >
                    {person.name}
                  </p>
                </div>
              ))
            )
            : (
              <div
                className="dropdown-item"
              >
                <p>
                  No matching suggestions
                </p>
              </div>
            )}

        </div>
      </div>

    );
  },
);
