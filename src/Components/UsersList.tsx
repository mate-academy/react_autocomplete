import { Person } from '../types/Person';
import React from 'react';

type Props = {
  users: Person[];
  onSelectedUser: (user: Person) => void;
};

const UserListComponent: React.FC<Props> = ({ users, onSelectedUser }) => {
  return (
    <>
      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {users.map(user => {
            return (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={user.slug}
                onClick={() => {
                  onSelectedUser(user);
                }}
              >
                <p className="has-text-link">{user.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export const UserList = React.memo(UserListComponent);
