import React from 'react';
import { Person } from '../../types/Person';

type Props = {
  person: Person;
};

export const PersonInfo: React.FC<Props> = ({ person }) => {
  return (
    <h1 className="title is-3 has-has-text-danger">
      {`${person.name} (${person.born} - ${person.died})`}
    </h1>
  );
};
