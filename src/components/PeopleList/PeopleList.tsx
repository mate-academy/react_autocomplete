import React from 'react';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  onSelected?: (person: Person) => void;
};

export const PeopleList: React.FC<Props> = React.memo(
  ({ people, onSelected = () => {} }) => {
    return (
      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {people.map(person => (
            <div
              className="dropdown-item"
              data-cy="suggestion-item"
              key={person}
              onMouseDown={() => onSelected(person)}
            >
              <p className="has-text-link">{person.name}</p>
            </div>
          ))}
        </div>
      </div>
    );
  },
);

PeopleList.displayName = 'PeopleList';
