import React from 'react';
import classNames from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  onSelected: (name: string) => void;
};

export const Dropdown: React.FC<Props> = ({ people, onSelected }) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length > 0
          ? people.map((person: Person) => (
            <a
              href={person.slug}
              className="dropdown-item"
              onMouseDown={() => {
                onSelected(person.slug);
              }}
              key={person.slug}
            >
              <p className={classNames('has-text-link', {
                'has-text-danger': person.sex === 'f',
              })}
              >
                {person.name}
              </p>
            </a>
          ))
          : (
            <div>
              No matching suggestions
            </div>
          )}
      </div>
    </div>
  );
};
