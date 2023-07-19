import React from 'react';
import classNames from 'classnames';

import { Person } from '../../types/Person';

type Props = {
  people: Person[],
  onSelect: (person: Person) => void,
};

export const PeopleList: React.FC<Props> = React.memo(({
  people,
  onSelect,
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length === 0
          ? (
            <p className="has-text-danger">
              No matching suggestions
            </p>
          ) : people.map(person => (
            <div
              className="dropdown-item"
              key={person.slug}
            >
              <p
                onClick={() => onSelect(person)}
                role="presentation"
                style={{ cursor: 'pointer' }}
                className={classNames({
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
});
