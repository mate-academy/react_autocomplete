import React from 'react';
import { Person } from '../types/Person';

type Props = {
  selectPerson: Person | null,
};
export const DropdownTitle: React.FC<Props> = ({ selectPerson }) => {
  return (
    <h1 className="title">
      {selectPerson
        ? (`${selectPerson.name} (${selectPerson.born} - ${selectPerson.died}) `)
        : (<p>No person selected</p>)}
    </h1>
  );
};
