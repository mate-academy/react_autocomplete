import React from 'react';
import { Date } from '../../types/Date';

interface Props {
  data: Date[];
}

export const Title: React.FC<Props> = ({ data }) => {
  const { name, born, died } = data[0];

  return (
    <h1 className="title">
      {`${name} (${born} = ${died})`}
    </h1>
  );
};
