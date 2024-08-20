import { FC } from 'react';
import { Person } from '../types/Person';

type TitleProps = {
  person: Person;
};

export const Title: FC<TitleProps> = ({ person }) => {
  const { name, born, died } = person;

  return (
    <h1 className="title" data-cy="title">
      {`${name} (${born} - ${died})`}
    </h1>
  );
};
