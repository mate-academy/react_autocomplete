import { FC } from 'react';

import { Person } from '../../types/Person';

import { User } from '../User.ts';

type TUserListProps = {
  users: Person[];
  handleUserSelect: (user: Person) => void;
};

export const UserList: FC<TUserListProps> = ({
  users,
  handleUserSelect,
}) => (
  <div
    style={{ width: '100%' }}
    className="dropdown-menu"
    role="menu"
  >
    <div className="dropdown-content">
      {users.map(user => (
        <User
          key={user.slug}
          user={user}
          handleUserSelect={handleUserSelect}
        />
      ))}
    </div>
  </div>
);
