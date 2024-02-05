import React from 'react';
import { Person } from '../types/Person';

type Props = {
  PersonList : Person[],
  setSelect:React.Dispatch<React.SetStateAction<Person | undefined>>,
  setActive:React.Dispatch<React.SetStateAction<boolean>>,
  setQueryData?: any
};

export const ListUser: React.FC<Props> = ({
  PersonList,
  setSelect,
  setActive,
  setQueryData,

}) => {
  const selecteOn = (e: React.MouseEvent<HTMLButtonElement>,
    person: Person) => {
    e.preventDefault();

    setSelect(person);
    setActive(true);
    setQueryData(person?.name);
  };

  return (
    <div className="dropdown-content">
      {PersonList.map(person => (
        <button
          type="button"
          key={person.slug}
          className="dropdown-item"
          data-cy="suggestion-item"
          onClick={(e) => selecteOn(e, person)}
        >
          <p
            className="has-text-link"
          >
            {person.name}
          </p>
        </button>
      ))}
    </div>
  );
};
