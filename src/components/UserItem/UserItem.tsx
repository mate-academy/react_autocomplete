import React from 'react';
import { Person } from '../../types/Person';

interface Props {
  person: Person;
}

export const UserItem: React.FC<Props> = ({ person }) => {
  return (
    <div className="dropdown-item" data-cy="suggestion-item">
      <p className="has-text-link">{person.name}</p>
    </div>
  );
};
