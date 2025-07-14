import React from 'react';
import { Person } from '../types/Person';

type Props = {
  person: Person;
  onSelected: (id: string) => void;
};

export const DropdownItem: React.FC<Props> = ({ person, onSelected }) => {
  return (
    <div
      className="dropdown-item"
      data-cy="suggestion-item"
      onClick={() => onSelected(person.slug)}
    >
      <p
        className={`${person.sex === 'm' ? 'has-text-link' : 'has-text-danger'}`}
      >
        {person.name}
      </p>
    </div>
  );
};
