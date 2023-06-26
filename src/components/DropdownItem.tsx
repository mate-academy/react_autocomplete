import React, { FC } from 'react';
import { Person } from '../types/Person';

interface Props {
  person: Person;
  setSelectedPerson: (value: string) => void,
  setSearchName: (value: string) => void,
}

export const DropdownItem: FC<Props> = React.memo(({
  person,
  setSelectedPerson,
  setSearchName,
}) => {
  const {
    slug,
    sex,
    name,
  } = person;

  const handleClicker = (value: string) => {
    setSelectedPerson(value);
    setSearchName(name);
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className="dropdown-item"
      onClick={() => handleClicker(slug)}
      style={{ cursor: 'pointer' }}
    >
      <p className={sex === 'm'
        ? 'has-text-link'
        : 'has-text-danger'}
      >
        {name}
      </p>
    </div>
  );
});
