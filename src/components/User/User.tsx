import React from 'react';
import { Props } from '.';
import classNames from 'classnames';

export const User: React.FC<Props> = React.memo(({ user, onSelected }) => {
  // eslint-disable-next-line no-console
  console.log('render User');
  const sex = user.sex === 'm';

  return (
    <div
      className="dropdown-item"
      data-cy="suggestion-item"
      onMouseDown={() => onSelected(user)}
    >
      <p
        className={classNames(
          { 'has-text-link': sex },
          { 'has-text-danger': !sex },
        )}
      >
        {user.name}
      </p>
    </div>
  );
});

User.displayName = 'User';
