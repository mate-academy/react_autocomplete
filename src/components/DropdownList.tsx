import React from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onClick?: (person: Person) => void;
};

export const DropdownList: React.FC<Props> = React.memo(({
  people,
  onClick = () => { },
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length > 0
          ? (people.map(person => (
            <a
              href="#/"
              className="dropdown-item"
              key={person.slug}
              onClick={(event) => {
                event.preventDefault();
                onClick(person);
              }}
            >
              <p
                className={classNames({
                  'has-text-link': person.sex === 'm',
                  'has-text-danger': person.sex === 'f',
                })}
              >
                {person.name}
              </p>
            </a>
          )))
          : (
            <div className="dropdown-item">
              <p>
                No matching suggestions
              </p>
            </div>
          )}
      </div>
    </div>
  );
});
