import React from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  PersonList : Person[],
  setActive:React.Dispatch<React.SetStateAction<boolean>>,
  setQueryData: React.Dispatch<React.SetStateAction<string>>,
  setTitle: React.Dispatch<React.SetStateAction<string>>
};

export const ListUser: React.FC<Props> = ({
  PersonList,
  setActive,
  setQueryData,
  setTitle,

}) => {
  const selecteOn = (e: React.MouseEvent<HTMLButtonElement>,
    person: Person) => {
    e.preventDefault();
    setActive(true);
    setQueryData(person?.name);
    setTitle(`${person?.name} (${person?.born} - ${person?.died})`);
  };

  return (
    <div className="dropdown-content">
      {PersonList.length > 0 ? PersonList.map(person => (
        <button
          type="button"
          key={person.slug}
          className={classNames(
            'dropdown-item',
            { 'has-text-danger': person.sex === 'f' },
          )}
          data-cy="suggestion-item"
          onClick={(e) => selecteOn(e, person)}
        >
          <p
            className="has-text-link"
          >
            {person.name}
          </p>
        </button>
      )) : (
        <div className="dropdown-item">
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </div>
  );
};
