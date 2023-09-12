import React from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  person: Person
  onPersonSelect: (person: Person) => void;
};

export const DropdownItem: React.FC<Props> = ({ person, onPersonSelect }) => (
  <div
    className="dropdown-item"
    role="button"
    tabIndex={0}
    onClick={() => onPersonSelect(person)}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === 'Space') {
        onPersonSelect(person);
      }
    }}
  >
    <p
      className={classNames('has-text-link', {
        'has-text-danger': person.sex === 'f',
        'has-text-link': person.sex === 'm',
      })}
    >
      {person.name}
    </p>
  </div>
);
