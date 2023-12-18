import cn from 'classnames';
import React from 'react';
import { Person } from '../../types/Person';
import './PeopleList.scss';

type Props = {
  people: Person[];
  onSelect: (name: string) => void;
};

export const PeopleList: React.FC<Props> = (({
  people,
  onSelect = () => {},
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length ? people.map((person: Person) => (
          <button
            type="button"
            className="dropdown-item"
            key={person.name}
            onMouseDown={() => {
              onSelect(person.name);
            }}
          >
            <p className={cn({
              'has-text-danger': person.sex === 'f',
              'has-text-link': person.sex === 'm',
            })}
            >
              {person.name}
            </p>
          </button>
        )) : (
          <div className="dropdown-item">
            No matching suggestions
          </div>
        )}
      </div>
    </div>
  );
});
