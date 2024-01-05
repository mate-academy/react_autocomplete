import React, { useCallback, useState } from 'react';
import 'bulma/css/bulma.css';
import './App.scss';
import { Person } from './types/Person';
import { Autocomplete } from './Autocomplete/Autocomplete';
import { peopleFromServer } from './data/people';
import { getPeopleByName } from './services/getPeopleByName';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person>();
  const [people, setPeople] = useState<Person[]>(peopleFromServer);

  const handlePerson = useCallback((event: Person) => {
    setSelectedPerson(event);
  }, []);

  const filterPeople = useCallback((name: string) => {
    setPeople(getPeopleByName(name));
  }, []);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? (`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`)
          : 'Nobody was selected'}
      </h1>

      <Autocomplete
        people={people}
        delay={1000}
        onSelected={handlePerson}
        filterPeople={filterPeople}
      />
    </main>
  );
};
