import React from 'react';
import classNames from 'classnames';

import { Person } from '../types/Person';

type Props = {
  users: Person[],
  onSelect?: (person: Person) => void,
  isVisible: boolean
};

export const PeopleList: React.FC<Props> = React.memo(({
  users,
  onSelect = () => {},
  isVisible,
}) => {
  const handlePersonKeyDown = (event: React.KeyboardEvent, person: Person) => {
    if (event.key === 'Enter' || event.key === 'Space') {
      event.preventDefault();
      onSelect(person);
    }
  };

  return (
    <div
      className={`dropdown-menu ${isVisible ? 'is-active' : 'is-hidden'}`}
      role="menu"
    >
      <div className="dropdown-content">
        {
          users.length === 0
            ? (
              <div className="dropdown-item">
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )
            : (users.map((user) => (
              <div
                role="button"
                tabIndex={0}
                className="dropdown-item"
                key={user.slug}
                onMouseDown={() => onSelect(user)}
                onKeyDown={(event) => handlePersonKeyDown(event, user)}
              >
                <span className={classNames(
                  user.sex === 'm'
                    ? 'has-text-link'
                    : 'has-text-danger',
                )}
                >
                  {user.name}
                </span>
              </div>
            ))
            )
        }
      </div>
    </div>
  );
});
