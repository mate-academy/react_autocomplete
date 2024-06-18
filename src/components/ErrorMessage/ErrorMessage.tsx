export const ErrorMessage = () => {
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
      <p className="has-text-danger">No matching suggestions</p>
    </div>
  );
};
