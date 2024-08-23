import React from 'react';
import { Person } from '../../types/Person';

type Props = {
  person: Person;
  onSelect?: (person: Person) => void;
};

export const DropdownItem: React.FC<Props> = ({
  person,
  onSelect = () => {},
}) => {
  return (
    <div
      className="dropdown-item"
      data-cy="suggestion-item"
      onClick={() => onSelect(person)}
    >
      <p className="has-text-link">{person.name}</p>
    </div>
  );
};
