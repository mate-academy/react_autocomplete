import React from 'react';
import classNames from 'classnames';

type Props = {
  message: string;
  visible: boolean;
};

export const Notification: React.FC<Props> = ({ message, visible }) => {
  if (!visible) {
    return null;
  }

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
      <p>{message}</p>
    </div>
  );
};
