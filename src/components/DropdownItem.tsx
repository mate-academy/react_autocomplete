import React from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  person: Person,
  onSelected: (person: Person) => void,
};

export const DropdownItem: React.FC<Props> = React.memo(
  ({
    person,
    onSelected,
  }) => {
    return (
      <button
        type="button"
        className="dropdown-item"
        onClick={() => onSelected(person)}
      >
        <p
          className={classNames(
            {
              'has-text-link': person.sex === 'm',
              'has-text-danger': person.sex === 'f',
            },
          )}
        >
          {person.name}
        </p>
      </button>
    );
  },
);
