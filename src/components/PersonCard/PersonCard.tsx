import React from 'react';
import cn from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  person: Person,
  setSelectedPerson: (person: Person) => void;
  setShownList: (isShown: boolean) => void;
  setQuery: (newQuery: string) => void;
};

export const PersonCard: React.FC<Props> = React.memo(({
  person,
  setSelectedPerson,
  setShownList,
  setQuery,
}) => {
  const handleSelectedPerson = () => {
    setSelectedPerson(person);
    setQuery(person.name);
    setShownList(false);
  };

  return (
    <div className="dropdown-item">
      <button
        type="button"
        className={cn('button is-white', {
          'has-text-link': person.sex === 'm',
          'has-text-danger': person.sex === 'f',
        })}
        onMouseDown={handleSelectedPerson}
      >
        {person.name}
      </button>
    </div>
  );
});
