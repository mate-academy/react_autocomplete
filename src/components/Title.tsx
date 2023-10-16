import React from 'react';
import { Person } from '../types/Person';

interface TitleProps {
  person: Person
}

export const Title: React.FC<TitleProps> = React.memo(({ person }) => {
  const { name, born, died } = person;

  return (
    <h1 className="title">
      {`${name} (${born} = ${died})`}
    </h1>
  );
});
