import React from 'react';
import { Person } from '../../types/Person';

interface Props {
  currentPerson: Person | null;
}

export const PersonInfo: React.FC<Props> = ({ currentPerson }) => (
  <h1 className="title">
    {currentPerson ? (
      `${currentPerson.name} (${currentPerson.born} - ${currentPerson.died})`
    ) : (
      'No selected person'
    )}
  </h1>
);
