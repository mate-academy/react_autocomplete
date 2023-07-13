import React from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  people: Person[],
  onSelect: (person: Person) => void,
}

export const Dropdown: React.FC<Props> = ({ people, onSelect }) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length > 0 ? (
          people.map(person => (
            <div
              className="dropdown-item"
              key={person.slug}
            >
              <p
                className={classNames({'has-text-link': person.sex === 'm',
                  'has-text-danger': person.sex === 'f',
                })}
                onClick={() => onSelect(person)}
              >
                {person.name}
              </p>
            </div>
          ))
        ) : (
          <div className="dropdown-item">
            <p className="has-text-danger">No matches</p>
          </div>
        )}
      </div>
    </div>
  );
}
