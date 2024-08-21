import { FC } from 'react';
import { Person } from '../types/Person';

type TitleProps = {
  person?: Person;
  text?: string;
};

export const Title: FC<TitleProps> = ({ person, text }) => {
  return (
    <h1 className="title" data-cy="title">
      {person ? `${person?.name} (${person.born} - ${person.died})` : `${text}`}
    </h1>
  );
};
