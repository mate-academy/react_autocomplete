import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown';
import { Notification } from './components/Notification';
import { isPartInText } from './components/Dropdown/Context';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [personName, setPersonName] = useState('');

  const isMatch = (): boolean => {
    return peopleFromServer.some(person =>
      isPartInText(person.name, personName),
    );
  };

  const getPerson = (): Person | undefined => {
    return peopleFromServer.find(person => person.name === personName);
  };

  const onSelected = (newPersonName: string) => {
    setPersonName(newPersonName);
  };

  const person = getPerson();

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {person
            ? `${person.name} (${person.born} - ${person.died})`
            : 'No selected person'}
        </h1>

        <Dropdown
          people={peopleFromServer}
          delay={300}
          personName={personName}
          onSelected={onSelected}
        />

        {!isMatch() && <Notification />}
      </main>
    </div>
  );
};
