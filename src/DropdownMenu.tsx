import React from 'react';
import cn from 'classnames';
import { Person } from './types/Person';

interface Props {
  people: Person[];
  onSelected: (person: Person) => void;
}

export const DropdownMenu: React.FC<Props> = ({
  people,
  onSelected,
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length > 0
          ? (
            people.map((person) => (
              <div className="dropdown-item" key={person.slug}>
                <a
                  href="/"
                  className={cn('dropdown-item', {
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
            ))
          ) : (
            <span className="dropdown-item">
              No matching suggestions
            </span>
          )}
      </div>
    </div>
  );
};
