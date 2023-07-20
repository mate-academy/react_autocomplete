import React from 'react';
import { Person } from '../../types/Person';

type Props = {
  selectedPerson: Person | null,
};

export const PersonInfo: React.FC<Props> = ({ selectedPerson }) => {
  return (
    <>
      {selectedPerson ? (
        <h1 className="title is-3 has-has-text-danger">
          {`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
        </h1>
      ) : (
        <h1 className="title is-3 has-has-text-danger">No person selected.</h1>
      )}
    </>
  );
};
