import React, { useState, useEffect } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropDown } from './components/dropdown/dropdown/dropdown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPersonName, setSelectedPersonName] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | undefined>(undefined);
  useEffect(() => {
    const person = peopleFromServer.find((person) => person.name === selectedPersonName);
    setSelectedPerson(person);
  }, [selectedPersonName]);
  


  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})` : 'No selected person'}
        </h1>

        <DropDown callback = {(name) => setSelectedPersonName(name)} delay = {300} people={peopleFromServer}/>

        
      </main>
    </div>
  );
};
