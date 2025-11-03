type NotificationProps = {
  textNotification: string;
};

export const Notification: React.FC<NotificationProps> = ({
  textNotification,
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
      <p className="has-text-danger">{textNotification}</p>
    </div>
  );
};
