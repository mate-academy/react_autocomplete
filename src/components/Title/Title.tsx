import React from 'react';
import { Person } from '../../types/Person';

type Props = {
  user: Person | null;
};

export const Title: React.FC<Props> = ({ user }) => {
  return (
    <h1 className="title" data-cy="title">
      {user
        ? `${user.name} (${user.born} - ${user.died})`
        : 'No selected person'}
    </h1>
  );
};
