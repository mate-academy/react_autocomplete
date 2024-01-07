import cn from 'classnames';

type Props = {
  query: string;
};

export const Autocomplete: React.FC<Props> = ({ query }) => {
  return (
    <div className={cn('dropdown', {
      'is-active': query,
    })}
    >
      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          <p className="dropdown-item">
            Dropdown item
          </p>
          <p className="dropdown-item">
            Other dropdown item
          </p>
          <p className="dropdown-item is-active">
            Active dropdown item
          </p>
          <p className="dropdown-item">
            Other dropdown item
          </p>
          <hr className="dropdown-divider" />
          <p className="dropdown-item">
            With a divider
          </p>
        </div>
      </div>
    </div>
  );
};
