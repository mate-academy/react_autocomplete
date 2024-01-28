import React from 'react';
import cn from 'classnames';

import { Person } from '../../types/Person';

type Props = {
  persons: Person[];
  onSelect?: (person: Person) => void,
};

export const PersonList: React.FC<Props> = React.memo((({
  persons,
  onSelect = () => { },
}) => {
  // console.log('ren PersonList');
  // console.log(persons);

  return (
    <div className="dropdown-item is-active">
      {persons.length === 0 ? (
        <div className="dropdown-item">
          No matching suggestions
        </div>
      ) : (
        persons.map(person => (
          <div
            key={person.slug}
            className={cn('dropdown-item', {
              'has-text-link': person.sex === 'm',
              'has-text-danger': person.sex === 'f',

            })}
            onClick={() => onSelect(person)}
            onKeyDown={() => onSelect(person)}
            role="tab"
            tabIndex={0}
          >
            {`${person.name}`}
          </div>
        ))
      )}
    </div>
  );
}));
