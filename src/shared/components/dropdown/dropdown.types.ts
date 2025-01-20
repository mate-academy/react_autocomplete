import { Person } from '../../../types/Person';
import React, { Dispatch, SetStateAction } from 'react';

export type DropdownProps = {
  people: Array<Person>;
  setSelectedPerson: Dispatch<SetStateAction<Person | null>>;
  onChange: (event: {
    target: { value: string };
  }) => void | ((event: React.ChangeEvent<HTMLInputElement>) => void);
  value: string;
};
