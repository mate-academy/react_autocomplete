/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import classNames from 'classnames';

import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  handleSelectedPerson: (person: Person) => void;
};

export const DropdownMenu: React.FC<Props> = React.memo(({
  people,
  handleSelectedPerson,
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <ul className="dropdown-content">
        {people.length
          ? people.map((person) => (
            <li
              key={person.slug}
              className="dropdown-item"
            >
              <p
                className={
                  classNames({
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  })
                }
                onClick={() => {
                  handleSelectedPerson(person);
                }}
              >
                {person.name}
              </p>
            </li>
          ))
          : <li className="dropdown-item">No matching suggestions</li>}
      </ul>
    </div>
  );
});
