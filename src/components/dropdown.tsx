import React from 'react';
import { Person } from '../types/Person';

interface Props {
  people: Person[];
  onSelect?: (person: Person) => void;
}

export const Dropdown: React.FC<Props> = React.memo((
  {
    people,
    onSelect = () => { },
  },
) => (
  <div className="dropdown-menu" role="menu">
    <div className="dropdown-content">
      {!people.length ? (
        <div className="dropdown-item">
          <p>
            No matching suggestions
          </p>
        </div>
      ) : people.map(person => (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div
          key={person.name}
          className="dropdown-item"
          onClick={() => onSelect(person)}
        >
          <p
            className="has-text-link"
          >
            {person.name}
          </p>
        </div>
      ))}
    </div>
  </div>
));
