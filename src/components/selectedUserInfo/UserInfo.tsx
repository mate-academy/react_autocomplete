import React from 'react';
import { Person } from '../../types/Person';

interface Props {
  person: Person;
}

export const UserInfo: React.FC<Props> = ({ person }) => {
  const { name, born, died } = person;

  return (
    <h1 className="title" data-cy="title">
      {`${name} (${born} - ${died})`}
    </h1>
  );
};
