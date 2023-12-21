import './App.scss';
import React, { useState } from 'react';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { PeopleList } from './PeopleList';

export const App: React.FC = () => {
  const [selectedPerson, setSeletedPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <PeopleList
        people={peopleFromServer}
        delay={1000}
        onSelected={setSeletedPerson}
      />
    </main>
  );
};
