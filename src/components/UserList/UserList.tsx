import React from 'react';
import { Person } from '../../types/Person';
import { UserItem } from '../UserItem/UserItem';

interface Props {
  people: Person[];
}

export const UserList: React.FC<Props> = ({ people }) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {people.map(user => (
          <UserItem person={user} key={user.id} />
        ))}
      </div>
    </div>
  );
};
