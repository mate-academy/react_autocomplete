import { FC } from 'react';
import { Person } from '../types/Person';

type Props = {
  selectedPerson: Person | null;
};

export const Title: FC<Props> = ({ selectedPerson }) => {
  return (
    <h1 className="title" data-cy="title">
      {selectedPerson
        ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
        : 'No selected person'}
    </h1>
  );
};
