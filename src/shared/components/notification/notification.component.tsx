import React from 'react';

export type NotificationProps = {
  textMessage: string;
};

export const NotificationComponent: React.FC<NotificationProps> = ({
  textMessage,
}) => {
  return (
    <div
      className="
  notification
  is-danger
  is-light
  mt-3
  is-align-self-flex-start
  "
      role="alert"
      data-cy="no-suggestions-message"
    >
      <p className="has-text-danger">{textMessage}</p>
    </div>
  );
};
