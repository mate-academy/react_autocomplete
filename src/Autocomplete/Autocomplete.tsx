import React from 'react';
import { Person } from '../types/Person';
import classNames from 'classnames';

type Prop = {
  people: Person[];
  onSelected?: (person: Person) => void;
};

export const Autocomplete: React.FC<Prop> = ({
  people,
  onSelected = () => {},
}) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {people.map(person => {
          return (
            <div
              onClick={() => onSelected(person)}
              className="dropdown-item"
              data-cy="suggestion-item"
              key={person.slug}
            >
              <a className="dropdown-item">
                <p
                  className={classNames('', {
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  })}
                >
                  {person.name}
                </p>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};
