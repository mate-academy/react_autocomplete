import React, { memo } from 'react';
import cn from 'classnames';

import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelect: (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => void;
};

export const DropDown: React.FC<Props> = memo(({ people, onSelect }) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length !== 0 ? (
          people.map((person) => (
            <div className="dropdown-item" key={person.slug}>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#" onClick={(event) => onSelect(event, person)}>
                <p
                  className={cn(
                    { 'has-text-link': person.sex === 'm' },
                    { 'has-text-danger': person.sex === 'f' },
                  )}
                >
                  {person.name}
                </p>
              </a>
            </div>
          ))
        ) : (
          <div className="dropdown-item">
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </div>
    </div>
  );
});
