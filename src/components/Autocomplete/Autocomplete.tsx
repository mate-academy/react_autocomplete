/* eslint-disable */
import classNames from 'classnames';
import React from 'react';
import { Person } from '../../types/Person';
import './Autocomplete.scss';

type Props = {
  people: Person[],
  query: string,
  onSelected: (person: Person) => void,
  applyQuery: (query: string) => void,
  setQuery: (query: string) => void,
  setAppliedQuery: (query: string) => void,
};

export const Autocomplete: React.FC<Props> = ({ 
  people, 
  query, 
  onSelected,
  applyQuery,
  setQuery,
  setAppliedQuery
}) => {
  const selectPersonHandler = (person: Person) => {
    onSelected(person);
    setQuery(person.name);
    applyQuery('');
    setAppliedQuery('')
  }

  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {query && people.map(person => (
          <div className="dropdown-item person" key={person.slug}>
            <p
              className={classNames({
                'has-text-link': person.sex === 'm',
                'has-text-danger': person.sex === 'f',
              })}
              onClick={() => selectPersonHandler(person)}
            >
              {person.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
