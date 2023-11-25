import React from 'react';
import cn from 'classnames';
import { Person } from '../types/Person';

interface Props {
  personList: Person[],
  onSelect: (person: Person) => void,
}

export const PeopleList: React.FC<Props> = React.memo((
  { personList, onSelect },
) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {personList.length ? (personList.map(person => (
          <a
            href="/#"
            className="dropdown-item"
            key={person.slug}
            onClick={() => {
              onSelect(person);
            }}
          >
            <p className={cn({
              'has-text-link': person.sex === 'm',
              'has-text-danger': person.sex === 'f',
            })}
            >
              {person.name}
            </p>
          </a>
        ))) : (
          <p>No matches found</p>
        )}
      </div>
    </div>
  );
});
