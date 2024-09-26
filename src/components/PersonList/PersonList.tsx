import React from 'react';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  handleSuggestionClick: (person: Person) => void;
};

export const PersonList: React.FC<Props> = ({
  people,
  handleSuggestionClick,
}) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {people.map(person => (
          <div
            key={person.slug}
            onClick={() => {
              handleSuggestionClick(person);
            }}
            className="dropdown-item"
            data-cy="suggestion-item"
            tabIndex={1}
          >
            <p className="has-text-link">{person.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
