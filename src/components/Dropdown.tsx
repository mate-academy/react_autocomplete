import React from 'react';
import cn from 'classnames';
import { Person } from '../types/Person';

type Props = {
  visiblePeople: Person[],
};

export const Dropdown: React.FC<Props> = ({ visiblePeople }) => {
  return (
    <div className="dropdown-menu" role="menu">
      {visiblePeople.length === 0
        ? (
          <div className="dropdown-item">
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )
        : (
          <div className="dropdown-content">
            {visiblePeople.map(person => (
              <div key={person.slug} className="dropdown-item">
                <p className={cn({
                  'has-text-link': person.sex === 'm',
                  'has-text-danger': person.sex === 'f',
                })}
                >
                  {person.name}
                </p>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};
