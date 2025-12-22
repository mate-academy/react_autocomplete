import React from 'react';
import { Person } from '../../types/Person';
import { DropDownMenuItem } from '../DropDownMenuItem';

type Props = {
  suggestions: Person[];
  onSelect: (person: Person) => void;
};

export const DropDownMenu: React.FC<Props> = ({ suggestions, onSelect }) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {suggestions.map(person => (
          <DropDownMenuItem
            key={person.name}
            person={person}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
};
