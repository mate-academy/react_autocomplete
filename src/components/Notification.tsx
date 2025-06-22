import React from 'react';
import classNames from 'classnames';

type Props = {
  message: string;
};

export const Notification: React.FC<Props> = ({ message }) => {
  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'mt-3',
        'is-align-self-flex-start',
      )}
      role="alert"
      data-cy="no-suggestions-message"
    >
      <p className="has-text-danger">{message}</p>
    </div>
  );
};
