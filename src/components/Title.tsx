import React from 'react';

type Props = {
  name: string | undefined;
  born: number | undefined;
  died: number | undefined;
};

export const Title: React.FC<Props> = ({ name, born, died }) => {
  return (
    <h1 className="title">
      {(name && born && died) ? `${name} (${born} = ${died})` : 'No selected person'}
    </h1>
  );
};
