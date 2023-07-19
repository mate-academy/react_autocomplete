import React from 'react';
import { Person } from '../types/Person';

interface Props {
  people: Person[];
  onSelect?: (person: Person) => void;
}

export const PeopleList: React.FC<Props> = ({
  people,
  onSelect = () => {},
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {!people.length ? (
          <p className="has-text-danger">No matching suggestions</p>
        ) : people.map(person => (
          <div
            className="dropdown-item"
            key={person.slug}
            onClick={() => onSelect(person)}
            onKeyDown={() => onSelect(person)}
            role="button"
            tabIndex={0}
          >
            <p className="has-text-link">
              {person.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
