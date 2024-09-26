import React from 'react';
import cn from 'classnames';

import { Person } from '../../types/Person';
import { PeopleInfo } from '../PersonInfo';

type Props = {
  peoples: Person[];
  isFocused: boolean;
  onChange: (people: Person) => void;
};

export const PeopleList: React.FC<Props> = ({
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
        {peoples.map(person => (
          <PeopleInfo person={person} onClick={onChange} />
        ))}
      </div>
    </div>
  );
};
