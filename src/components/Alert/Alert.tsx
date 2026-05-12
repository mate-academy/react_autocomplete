interface Props {
  message: string;
}

export const Alert = ({ message }: Props) => (
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
