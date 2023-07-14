import React from 'react';
import classNames from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  persons: Person[],
  onSelect: (person: Person) => void,
};

export const PersonList: React.FC<Props> = React.memo(
  ({ persons, onSelect }) => {
    return (
      <>
        {persons.length !== 0 ? (
          persons.map(person => (
            <div
              className="dropdown-item"
              key={person.slug}
            >
              <tr
                className={classNames(
                  'has-text-link',
                  {
                    'has-text-danger': person.sex === 'f',
                  },
                )}
                onClick={() => onSelect(person)}
              >
                <p style={{ cursor: 'pointer' }}>
                  {person.name}
                </p>
              </tr>
            </div>
          ))
        ) : (
          <div className="dropdown-item">
            <p className="has-text-link has-text-danger">
              No matching suggestions
            </p>
          </div>
        )}
      </>
    );
  },
);
