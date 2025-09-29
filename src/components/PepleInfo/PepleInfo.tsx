import React from 'react';
import { Person } from '../../types/Person';

interface Props {
  pesron: Person;
}

export const PepleInfo: React.FC<Props> = ({ pesron }) => (
  <div className="dropdown-item" data-cy="suggestion-item">
    <p className="dropdown-item">{pesron.name}</p>
  </div>
);
