import React from 'react';
import { Person } from '../types/Person';

type DropdownMenuProps = {
  suggestions: Person[];
  conditionShowDropdown: boolean;
  selectPersonFromTheList: (
    event: React.MouseEvent<HTMLParagraphElement>,
  ) => void;
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  suggestions,
  conditionShowDropdown,
  selectPersonFromTheList,
}) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      {conditionShowDropdown && (
        <div className="dropdown-content">
          <div className="dropdown-item" data-cy="suggestion-item">
            {suggestions.map(person => (
              <p
                className="has-text-link"
                key={person.slug}
                onClick={selectPersonFromTheList}
              >
                {person.name}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
