import React from 'react';
import { Person } from '../types/Person';
type Props = {
  visiblePeople: Person[];
  onSelected: (value: Person) => void;
};
export const DropDown: React.FC<Props> = ({
  visiblePeople,

  onSelected: onSelected,
}) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {visiblePeople.map((person, index) => (
          <React.Fragment key={index}>
            <div
              className="dropdown-item"
              data-cy="suggestion-item"
              onClick={() => onSelected(person)}
            >
              <p className="has-text-link">{person.name}</p>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
