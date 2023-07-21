/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { FC } from 'react';
import { Person } from '../types/Person';

interface Props {
  people: Person[];
  selectPerson: (person: Person) => void;
}

export const Dropdown: FC<Props> = ({
  selectPerson,
  people,
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length !== 0
          ? (
            people.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
              >
                <p
                  className="has-text-link"
                  onClick={() => {
                    selectPerson(person);
                  }}
                >
                  {person.name}
                </p>
              </div>
            )))
          : (
            <span>No matching suggestions</span>
          )}
      </div>
    </div>
  );
};
