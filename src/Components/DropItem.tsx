import React from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  person: Person,
  onSelected: (person: Person) => void
};

export const DropItem: React.FC<Props> = React.memo(
  ({ person, onSelected }) => (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      className="dropdown-item"
      role="button"
      tabIndex={0}
      onClick={() => onSelected(person)}
    >
      <p className={classNames({
        'has-text-link': person.sex === 'm',
        'has-text-danger': person.sex === 'f',
      })}
      >
        {person.name}
      </p>
    </div>
  ),
);
