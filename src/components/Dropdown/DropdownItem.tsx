import React, { useContext } from 'react';
import { Person } from '../../types/Person';
import { Context } from './Context';

type Props = {
  person: Person;
};

export const DropdownItem: React.FC<Props> = ({ person }) => {
  const { onSelected, changeInputPersonName } = useContext(Context);

  const handleClick = () => {
    changeInputPersonName(person.name);
    onSelected(person.name);
  };

  return (
    <div
      className="dropdown-item"
      data-cy="suggestion-item"
      onMouseDown={handleClick}
    >
      <p className={person.sex === 'f' ? 'has-text-danger' : 'has-text-link'}>
        {person.name}
      </p>
    </div>
  );
};
