import React from 'react';
import { Person } from '../../types/Person';

type Props = {
  allPeople: Person[];
  onItemClick: (person: Person) => void;
};

export const SuggestionsList: React.FC<Props> = ({
  allPeople,
  onItemClick = () => {},
}) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {allPeople.map(people => (
          <div
            className="dropdown-item"
            data-cy="suggestion-item"
            key={people.slug}
            onMouseDown={() => onItemClick(people)}
          >
            <p className="has-text-link">{people.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
