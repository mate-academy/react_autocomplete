import React from 'react';
import { Person } from '../../types/Person';
type Props = {
  person: Person | null;
};

export const Header: React.FC<Props> = React.memo(({ person }) => {
  return (
    <h1 className="title" data-cy="title">
      {person
        ? `${person.name} (${person.born} - ${person.died})`
        : 'No selected person'}
    </h1>
  );
});
