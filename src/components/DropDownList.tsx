import React from 'react';
import { Person } from '../types/Person';

type Props = {
  list: Person[];
  onSelected: (person: Person) => void;
};

export const DropDownList: React.FC<Props> = ({ list, onSelected }) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {list.map(person => (
          <div
            className="dropdown-item"
            data-cy="suggestion-item"
            key={person.slug}
            onMouseDown={() => onSelected(person)}
          >
            <p className="has-text-link">{person.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
