import React from 'react';
import { Person } from '../types/Person';

type Props = {
  pupil: Person;
};

export const PersonFromList: React.FC<Props> = ({ pupil }) => {
  return (
    <div className="dropdown-item" data-cy="suggestion-item">
      <p className="has-text-link">{pupil.name}</p>
    </div>
  );
};
