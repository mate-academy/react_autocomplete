import classNames from 'classnames';
import React from 'react';

import { Person } from '../../types/Person';

type Props = {
  people: Person[],
  onSelected: (peson: Person) => void,
};

export const Suggestions: React.FC<Props> = React.memo(({
  people,
  onSelected = () => {},
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length === 0 ? (
          <div className="dropdown-item">
            <p>
              No matching suggestions
            </p>
          </div>
        )
          : people.map(person => (
            <a
              className="dropdown-item item"
              onClick={() => onSelected(person)}
            >
              <p className={classNames({
                'has-text-link': person.sex === 'm',
                'has-text-danger': person.sex === 'f',
              })}
              >
                {person.name}
              </p>
            </a>
          ))}
      </div>
    </div>
  );
});
