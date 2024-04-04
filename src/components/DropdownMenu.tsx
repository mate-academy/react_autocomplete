import React from 'react';
import { Person } from '../types/Person';

interface Props {
  users: Person[];
  onUserSelect: (name: Person) => void;
}

export const DropdownMenu: React.FC<Props> = ({ users, onUserSelect }) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div
        className="dropdown-content"
        style={{ maxHeight: '200px', overflowY: 'auto' }}
      >
        {users.map(user => (
          <div
            className="dropdown-item"
            data-cy="suggestion-item"
            key={user.name}
          >
            <a
              onClick={() => onUserSelect(user)}
              className="has-text-link hoverable"
            >
              {user.name}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
