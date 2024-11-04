export const Notification = () => (
  <div
    className="
      notification
      is-danger
      is-light
      mt-3
      is-align-self-flex-st
    "
    role="alert"
    data-cy="no-suggestions-message"
  >
    <p className="has-text-danger">No matching suggestions</p>
  </div>
);
