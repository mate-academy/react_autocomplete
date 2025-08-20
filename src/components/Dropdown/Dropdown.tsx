import React, { useCallback } from 'react';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  onSelected?: (person: Person) => void;
};

export const Dropdown = React.memo(function Dropdown({
  people,
  onSelected = () => {},
}: Props) {
  const handleClick = useCallback(
    (person: Person) => {
      onSelected(person);
    },
    [onSelected],
  );

  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {people.map(person => (
          <div
            key={person.slug}
            className="dropdown-item"
            data-cy="suggestion-item"
            onMouseDown={() => handleClick(person)}
          >
            <p className="has-text-link">{person.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
});

Dropdown.displayName = 'Dropdown';
