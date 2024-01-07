import React from 'react';
import cn from 'classnames';
import './Autocomplete.scss';

import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';

type Props = {
  query: string;
  isFocus: boolean,
  onSelect: (name: string) => void
};

export const Autocomplete: React.FC<Props> = React.memo(({
  // query,
  isFocus,
  onSelect,
}) => {
  return (
    <div className={cn('dropdown', {
      'is-active': isFocus,
    })}
    >
      <div
        className="dropdown-menu"
        id="dropdown-menu"
        role="menu"
      >
        <div className="dropdown-content">
          {peopleFromServer.map((el: Person) => (
            <button
              type="button"
              className="dropdown-item"
              key={el.slug}
              onClick={() => onSelect(el.name)}
            >
              {el.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});
