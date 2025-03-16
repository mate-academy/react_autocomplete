import React from 'react';

type Props = {
  message: string;
};

export const Error: React.FC<Props> = ({ message }) => {
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
      <p className="has-text-danger">{message}</p>
    </div>
  );
};

export default Error;
