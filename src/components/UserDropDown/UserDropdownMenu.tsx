import React from 'react';
import { Person } from '../../types/Person';
import cn from 'classnames';

type Props = {
  filteredItems: Person[];
  handlePasteItem: (item: Person) => void;
};

export const UserDropdownMenu = React.memo(
  ({ filteredItems, handlePasteItem }: Props) => {
    return (
      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredItems.map(item => (
            <div
              className="dropdown-item"
              data-cy="suggestion-item"
              key={item.slug}
              onMouseDown={() => {
                handlePasteItem(item);
              }}
            >
              <p
                className={cn({
                  'has-text-link': item.sex === 'm',
                  'has-text-danger': item.sex === 'f',
                })}
              >
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  },
);
