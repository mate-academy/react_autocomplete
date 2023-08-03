import { FC } from 'react';
import { Person } from '../types/Person';

type Props = {
  person: Person;
};

export const PersonInfo: FC<Props> = ({ person }) => {
  const { name, born, died } = person;

  const info = `${name} (${born} - ${died})`;

  return (
    <p>
      {info}
    </p>
  );
};
