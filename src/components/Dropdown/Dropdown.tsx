import React from 'react';
import cn from 'classnames';

import { Person } from '../../types/Person';

type Props = {
  people: Person[],
  handleClick: (
    person: Person, event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => void,
  setIsInputFocused: React.Dispatch<React.SetStateAction<boolean>>,
};

export const Dropdown: React.FC<Props> = React.memo(({
  people,
  handleClick,
  setIsInputFocused,
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length
          ? people.map(person => (
            <a
              href={`#${person.slug}`}
              className={cn('dropdown-item', {
                'has-text-link': person.sex === 'm',
                'has-text-danger': person.sex === 'f',
              })}
              onClick={(event) => {
                handleClick(person, event);
                setIsInputFocused(false);
              }}
              key={person.slug}
            >
              {person.name}
            </a>
          ))
          : (
            <p className="dropdown-item">
              No matching suggestions
            </p>
          )}
      </div>
    </div>
  );
});
