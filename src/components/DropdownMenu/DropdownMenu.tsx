import React from 'react';
import classNames from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  people: Person[],
  onSelected: (person: Person) => void,
};

export const DropdownMenu: React.FC<Props> = React.memo(
  ({ people, onSelected }) => {
    return (
      <div
        className="dropdown-menu"
        role="menu"
        id="dropdown-menu"
      >
        <div className="dropdown-content">
          {people.length === 0
            ? (
              <div className="dropdown-item" style={{ cursor: 'pointer' }}>
                <p>
                  No matching suggestions
                </p>
              </div>
            ) : (
              people.map(person => (

                /* eslint-disable */
                <div
                  className="dropdown-item"
                  key={person.slug}
                  onClick={() => onSelected(person)}
                  style={{ cursor: 'pointer' }}
                  /* eslint-enable */
                >
                  <p
                    className={classNames({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                  >
                    {person.name}
                  </p>
                </div>
              ))
            )}
        </div>
      </div>
    );
  },
);
