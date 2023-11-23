import React from 'react';
import cn from 'classnames';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  handleClickPerson: (person: Person) => void;
};

export const UserList: React.FC<Props> = React.memo((({
  people,
  handleClickPerson,
}) => {
  // console.log('render UserList');

  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {!people.length
          && <span className="erorr">No matching suggestions</span>}
        {people.map(person => (
          <button
            type="button"
            key={person.name}
            className="dropdown-item"
            onClick={(event) => {
              event.preventDefault();
              handleClickPerson(person);
            }}
          >
            <div
              className={cn(
                { 'has-text-link': person.sex === 'm' },
                { 'has-text-danger': person.sex === 'f' },
              )}
            >
              {person.name}
              <hr />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}));
