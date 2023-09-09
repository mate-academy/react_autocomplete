import React from 'react';
import classNames from 'classnames';

import { Person } from '../../types/Person';

type Props = {
  person: Person,
  onSelect: (person: Person) => void,
};

export const DropdownPerson: React.FC<Props> = ({
  person,
  onSelect,
}) => {
  const isMale = (sex: string) => sex === 'm';

  return (
    <div
      className="dropdown-item"
    >
      <button
        type="button"
        onClick={() => onSelect(person)}
        className={classNames(
          'button',
          'is-small',
          'is-white',
          {
            'has-text-link': isMale(person.sex),
            'has-text-danger': !isMale(person.sex),
          },
        )}
      >
        {person.name}
      </button>
    </div>
  );
};
