import React from 'react';
import { Person } from '../../types/Person';

type ItemProps = {
  person: Person;
  onSelect: (person: Person) => void;
};

export const DropdownItem: React.FC<ItemProps> = ({ person, onSelect }) => {
  const className = person.sex === 'm' ? 'has-text-link' : 'has-text-danger';

  return (
    <div
      className="dropdown-item"
      data-cy="suggestion-item"
      onClick={() => onSelect(person)}
    >
      <p className={className}>{person.name}</p>
    </div>
  );
};
