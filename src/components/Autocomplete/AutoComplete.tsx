import { ChangeEvent, MouseEvent } from 'react';
import { Person } from '../../types/Person';
import { UserInfo } from '../UserInfo';

type Props = {
  users: Person[],
  isContentShown: boolean,
  onQueryChange: (event: ChangeEvent<HTMLInputElement>) => void,
  onUserClick: (event: MouseEvent<HTMLAnchorElement>, value: Person)
  => void,
};

export const AutoComplete: React.FC<Props> = ({
  users,
  isContentShown,
  onQueryChange,
  onUserClick,
}) => {
  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          onChange={onQueryChange}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        {isContentShown && (
          <div className="dropdown-content">
            {users.map(user => (
              <div
                key={user.slug}
                className="dropdown-item"
              >
                <a
                  href="/"
                  className="has-text-link"
                  onClick={event => onUserClick(event, user)}
                >
                  <UserInfo user={user} />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
