import React from 'react';
import { Person } from '../../types/Person';

interface DropDownType {
  users: Person[];
  onSelected?: (name: Person) => void;
}

export const UserDropDown: React.FC<DropDownType> = React.memo(
  ({ users, onSelected = () => {} }) => {
    return (
      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {users.map(item => {
            return (
              <a
                key={item.name + Math.round(Math.random() * 1000) / 1000}
                className="dropdown-item"
                onClick={(
                  e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
                ) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSelected(item);
                }}
                data-cy="suggestion-item"
              >
                {item.name}
              </a>
            );
          })}
        </div>
      </div>
    );
  },
);
