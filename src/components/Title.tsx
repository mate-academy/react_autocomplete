import React from 'react';
import { Person } from '../types/Person';

type TitleProps = {
  selectedPerson: Person | null
};
const Title: React.FC<TitleProps> = ({
  selectedPerson,
}) => {
  if (selectedPerson) {
    return (
      <h1 className="title">
        {`${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`}
      </h1>
    );
  }

  return (
    <h1 className="title">No selected person</h1>
  );
};

export default React.memo(Title);
