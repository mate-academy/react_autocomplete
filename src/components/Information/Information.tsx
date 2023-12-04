import React from 'react';

import { Person } from '../../types/Person';

interface ImformationProps {
  currentPerson?: Person | null,
}

const Information: React.FC<ImformationProps> = ({ currentPerson }) => {
  const { name, born, died } = currentPerson || {};

  return (
    <h1 className="title">
      {currentPerson ? `${name} (${born} - ${died})` : 'No selected person'}
    </h1>
  );
};

export default Information;
