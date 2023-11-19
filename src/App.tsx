import React, {
  useCallback, useState,
} from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Namelist } from './components/NameList';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>();

  const handlePersonSelect = useCallback((person: Person) => {
    setSelectedPerson(person);
  }, []);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          : 'No selected persone'}
      </h1>
      <Namelist
        names={peopleFromServer}
        onSelect={handlePersonSelect}
        delay={500}
      />
    </main>
  );
};
