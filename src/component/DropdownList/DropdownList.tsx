/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable @typescript-eslint/indent */
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
        // eslint-disable-next-line react/jsx-wrap-multilines, jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
        : <li
            // eslint-disable-next-line @typescript-eslint/indent
            onClick={() => setPerson(null)}
            className="dropdown-item"
            key="no-suggestions"
        >
          No matching suggestions
        </li>}
    </ul>
  );
};
