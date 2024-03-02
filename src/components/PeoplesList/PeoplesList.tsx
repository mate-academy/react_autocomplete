import React from 'react';
import cn from 'classnames';

import { Person } from '../../types/Person';
import { PeopleInfo } from '../PeopleInfo';

type Props = {
  peoples: Person[];
  isFocused: boolean;
  onChange: (people: Person) => void;
};

export const PeoplesList: React.FC<Props> = ({
  peoples,
  isFocused,
  onChange,
}) => {
  const classForDropdown = cn({
    'dropdown-menu': true,
    'is-hidden': isFocused,
  });

  return (
    <div className={classForDropdown} role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {peoples.map(people => (
          <PeopleInfo people={people} onClick={onChange} />
        ))}
      </div>
    </div>
  );
};
