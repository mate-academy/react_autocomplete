/* eslint-disable no-console */
import React, { useCallback, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Namelist } from './components/NameList';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [, setSelectedPerson] = useState<Person | null>();

  const handlePersonSelect = useCallback((person: Person | null) => {
    console.log('Selected Person:', person);

    setSelectedPerson(person);
  }, []);

  return (

    <Namelist
      names={peopleFromServer}
      onSelect={handlePersonSelect}
      delay={500}
    />
  );
};
