import { ChangeEvent, MouseEvent } from 'react';
import { Person } from '../../types/Person';
import { AutoCompleteUserInfo } from '../AutoCompleteUserInfo';

type Props = {
  users: Person[],
  query: string,
  isContentShown: boolean,
  onQueryChange: (event: ChangeEvent<HTMLInputElement>) => void,
  onUserClick: (event: MouseEvent<HTMLAnchorElement>, value: Person)
  => void,
};

export const AutoComplete: React.FC<Props> = ({
  users,
  query,
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
          value={query}
          onChange={onQueryChange}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        {isContentShown && (
          <div className="dropdown-content">
            {users.length
              ? (
                users.map(user => (
                  <div
                    key={user.slug}
                    className="dropdown-item"
                  >
                    <a
                      href="/"
                      className="has-text-link"
                      onClick={event => onUserClick(event, user)}
                    >
                      <AutoCompleteUserInfo user={user} />
                    </a>
                  </div>
                ))) : (<p>No matching suggestions</p>)}
          </div>
        )}
      </div>
    </div>
  );
};
