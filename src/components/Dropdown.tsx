import React from 'react';
import { Person } from '../types/Person';

interface Props {
  people: Person[];
  onSelect: (value: string) => void;
  setIsFocused: (value: boolean) => void;
}

export const Dropdown: React.FC<Props> = ({
  people,
  onSelect,
  setIsFocused,
}) => {
  const clickHandler = (personName: string) => {
    onSelect(personName);
    setIsFocused(false);
  };

  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {people.map(({ name, slug }) => (
          <div
            className="dropdown-item"
            data-cy="suggestion-item"
            key={slug}
            onMouseDown={() => {
              clickHandler(name);
            }}
          >
            <p className="has-text-link">{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
