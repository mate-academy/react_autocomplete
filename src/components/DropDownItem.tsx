import React from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  person: Person;
  onSelect: (person: Person) => void;
};

export const DropDownItem: React.FC<Props>
= React.memo(({ person, onSelect }) => {
  return (
    <div className="dropdown-item dropdown-item--container">
      <p
        className={classNames({
          'has-text-link': person.sex === 'm',
          'has-text-danger': person.sex === 'f',
        })}
      >
        {person.name}
      </p>
      <button
        className="button button--uniq"
        type="button"
        onClick={() => onSelect(person)}
      >
        O
      </button>
    </div>
  );
});
