import React from 'react';
import { Person } from '../../types/Person';

type Props = {
  person: Person | null
};

const SelectedTitle: React.FC<Props> = ({ person }) => {
  return (
    person ? (
      <h1 className="title">
        {`${person.name} (${person.born} - ${person.died})`}
      </h1>
    ) : (
      <h1 className="title">No selected user</h1>
    )
  );
};

export default SelectedTitle;
