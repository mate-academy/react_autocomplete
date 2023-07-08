import React from 'react';
import './DropdownItem.scss';
import { Person } from '../../types/Person';

type Props = {
  person: Person;
  onPersonClick: (person: Person) => void;

};

export const DropdownItem: React.FC<Props> = (
  { person, onPersonClick },
) => {
  return (
    <li
      className="dropdown-item"
    >
      <button
        type="button"
        className="button is-fullwidth is-info is-light"
        onClick={() => onPersonClick(person)}
      >
        {person.name}
      </button>
    </li>
  );
};
