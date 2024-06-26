import React from 'react';
import classNames from 'classnames';

import { Person } from './types/Person';

type Props = {
  list: Person[];
  onSelected: (person: Person) => void;
};

export const DropdownMenu: React.FC<Props> = ({ list, onSelected }) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {list.map(user => {
          return (
            <div
              key={user.name}
              className="dropdown-item"
              data-cy="suggestion-item"
            >
              <p
                className={classNames({
                  'has-text-danger': user.sex === 'f',
                  'has-text-link': user.sex === 'm',
                })}
                onClick={() => onSelected(user)}
              >
                {user.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
