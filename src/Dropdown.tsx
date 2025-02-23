import React from 'react';
import { Person } from './types/Person';

interface DropdownProps {
  isOpen: boolean;
  filterPeople: Person[];
  onSelectPerson: (person: Person) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  filterPeople,
  onSelectPerson,
}) => {
  if (!isOpen) {
    return null;
  } // Do not render dropdown if it's not open

  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {filterPeople.length > 0 ? (
          filterPeople.map((filterPerson, index) => (
            <a
              key={index}
              className="dropdown-item"
              data-cy="suggestion-item"
              onClick={() => onSelectPerson(filterPerson)}
            >
              <p className="has-text-link">{filterPerson.name}</p>
            </a>
          ))
        ) : (
          <div
            className="dropdown-item"
            data-cy="no-suggestions-message"
            role="alert"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </div>
    </div>
  );
};
