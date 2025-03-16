import React from 'react';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  onSelect: (title: Person | null) => void;
};

export const PersonList: React.FC<Props> = React.memo(
  ({ people, onSelect }) => {
    return (
      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {people.map(person => (
            <div
              className="dropdown-item"
              data-cy="suggestion-item"
              key={person.slug}
            >
              <p className="has-text-link" onClick={() => onSelect(person)}>
                {person.name}{' '}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  },
);

PersonList.displayName = 'PersonList';
