import React from 'react';
import { Person } from '../../types/Person';

type AutocompleteProps = {
  suggestions: Person[];
  conditionShowDropdown: boolean;
  selectPersonFromTheList: (
    event: React.MouseEvent<HTMLParagraphElement>,
  ) => void;
};

const Autocomplete: React.FC<AutocompleteProps> = ({
  suggestions,
  conditionShowDropdown,
  selectPersonFromTheList,
}) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      {conditionShowDropdown && (
        <div className="dropdown-content">
          {suggestions.map(({ name, slug }) => (
            <div className="dropdown-item" data-cy="suggestion-item" key={slug}>
              <p className="has-text-link" onClick={selectPersonFromTheList}>
                {name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
