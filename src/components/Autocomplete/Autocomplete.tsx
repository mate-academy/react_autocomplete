/* eslint-disable */
import classNames from 'classnames';
import React from 'react';
import { Person } from '../../types/Person';
import './Autocomplete.scss';

type Props = {
  people: Person[],
  query: string,
  onSelected: (person: Person) => void
};

export const Autocomplete: React.FC<Props> = ({ 
  people, 
  query, 
  onSelected 
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {query && people.map(person => (
          <div className="dropdown-item person">
            <p
              className={classNames({
                'has-text-link': person.sex === 'm',
                'has-text-danger': person.sex === 'f',
              })}
              onClick={() => onSelected(person)}
            >
              {person.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
