import React from 'react';

import { Person } from '../../types/Person';
import { PersonInfo } from '../PersonInfo';

type Props = {
  people: Person[],
  onItemClick: (person: Person) => void,
};

export const PersonList: React.FC<Props> = React.memo(({
  people,
  onItemClick,
}) => {
  return (
    <>
      {people.map(person => (
        <PersonInfo
          key={person.name}
          person={person}
          onClick={onItemClick}
        />
      ))}
    </>
  );
});
