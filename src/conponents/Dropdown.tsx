import React from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelected: (newPerson: Person) => void;
};

export const Dropdown: React.FC<Props> = React.memo(({
  people,
  onSelected,
}) => {
  return (
    <div className="dropdown-content">
      {people.map(person => (
        <div className="dropdown-item" key={person.name}>
          <a
            href='3/'
            className={classNames({
              'has-text-link': person.sex === 'm',
              'has-text-danger': person.sex === 'f',
            })}
            onClick={(event) => {
              event.preventDefault();
              onSelected(person);
            }}
          >
            {person.name}
          </a>
        </div>
      ))}
    </div>
  );
});
