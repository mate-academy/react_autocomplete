import React from 'react';
import { Person } from '../types/Person';

interface TitleProps {
  person: Person | null
}

export const Title: React.FC<TitleProps> = React.memo(({ person }) => {
  return (
    <>
      {
        person
          ? (
            <h1 className="title">
              {`${person.name} (${person.born} = ${person.died})`}
            </h1>
          )
          : (
            <h1 className="title">
              No selected person
            </h1>
          )
      }
    </>
  );
});
