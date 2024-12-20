import React from 'react';
import { Person } from '../../types/Person';

type Props = {
  user: Person[];
  onSelected?: (user: Person) => void;
};

export const Autocomplete: React.FC<Props> = ({
  user,
  onSelected = () => {},
}) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {user.map(el => (
          <div
            className="dropdown-item"
            data-cy="suggestion-item"
            key={el.slug}
            onMouseDown={() => onSelected(el)}
          >
            <p className={el.sex === 'm' ? 'has-text-link' : 'has-text-danger'}>
              {el.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
