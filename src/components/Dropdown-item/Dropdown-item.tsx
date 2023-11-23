import React from 'react';
import { Person } from '../../types/Person';

type Props = {
  person: Person;
  onSelect?: (person: Person) => void;
};

export const DropdownItem: React.FC<Props> = ({
  person,
  onSelect = () => { },
}) => (
  <div
    role="button"
    tabIndex={0}
    className="dropdown-item"
    key={person.slug}
    onClick={() => onSelect(person)}
    onKeyDown={() => onSelect(person)}
    style={{ cursor: 'pointer' }}
  >
    <p className="has-text-link">{person.name}</p>
  </div>
);
