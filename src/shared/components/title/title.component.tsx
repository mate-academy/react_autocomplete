import React from 'react';
import { TitleProps } from './title.types';

export const TitleComponent: React.FC<TitleProps> = ({ currentPerson }) => {
  return (
    <h1 className="title" data-cy="title">
      {currentPerson &&
        `${currentPerson.name} (${currentPerson.born} - ${currentPerson.died})`}
    </h1>
  );
};
