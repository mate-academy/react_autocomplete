import React, { useMemo } from 'react';
import cn from 'classnames';
import './Autocomplete.scss';

import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';

type Props = {
  query: string;
  isFocus: boolean,
  onSelect: (person: Person) => void
};

export const Autocomplete: React.FC<Props> = React.memo(({
  query,
  isFocus,
  onSelect,
}) => {
  const filteredPeople = useMemo(() => {
    return peopleFromServer
      .filter((el: Person) => el.name.includes(query));
  }, [query]);

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
          {filteredPeople.map((person: Person) => (
            <button
              type="button"
              className="dropdown-item"
              key={person.slug}
              onClick={() => onSelect(person)}
            >
              {person.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});
