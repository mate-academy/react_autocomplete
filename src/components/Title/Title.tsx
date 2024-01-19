import React from 'react';
import { Person } from '../../types/Person';

interface Props {
  data: Person[];
}

export const Title: React.FC<Props> = ({ data }) => {
  const { name, born, died } = data;

  return (
    <h1 className="title">
      {`${name} (${born} = ${died})`}
    </h1>
  );
};
