import React from 'react';
import classNames from 'classnames';

import { Person } from '../../types/Person';

interface Props {
  people: Person[];
  setPerson: React.Dispatch<React.SetStateAction<Person | null>>;
}

export const DropdownList: React.FC<Props> = ({ people, setPerson }) => {
  return (
    <ul className="dropdown-content">
      {people.length
        ? people.map(person => (
          /* eslint-disable-next-line */
          <li
            className="dropdown-item"
            onClick={() => setPerson(person)}
            key={person.name}
          >
            <p className={classNames(
              person.sex === 'm'
                ? 'has-text-link'
                : 'has-text-danger',
            )}
            >
              {person.name}
            </p>
          </li>
        ))
        /* eslint-disable-next-line */
        : <li
            onClick={() => setPerson(null)}
            className="dropdown-item"
            key="no-suggestions"
          >
            No matching suggestions
          </li>}
    </ul>
  );
};
