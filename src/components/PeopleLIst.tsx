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
          <button
            type="button"
            className="dropdown-item"
            key={person.slug}
            onClick={() => onSelect(person)}
          >
            <p className="has-text-link">
              {person.name}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
