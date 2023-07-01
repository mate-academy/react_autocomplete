import React from 'react';
import cn from 'classnames';
import { Person } from '../types/Person';

export interface Props {
  people: Person[],
  title: (arg: string) => void,
}

export const DropdownList: React.FC<Props> = React.memo(({ people, title }) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">

        {people.map(({
          name,
          sex,
          born,
          died,
        }) => (
          <div
            className="dropdown-item"
            key={`${name}_${Date.now()}`}
          >
            <a
              href="#/"
              className={cn({ 'has-text-link': sex === 'm' },
                { 'has-text-danger': sex === 'f' })}
              onClick={e => {
                e.preventDefault();
                title(`${name} (${born} - ${died})`);
              }}
            >
              {name}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
});
