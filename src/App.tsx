import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Search } from './components/Search.';
import { Title } from './components/Title';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<null | Person>(null);
  const onSelected = (person: Person | null) => {
    setSelectedPerson(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <Title selectedPerson={selectedPerson} />
        <Search
          allPeople={peopleFromServer}
          onSelected={onSelected}
          isSelectedPerson={!!selectedPerson}
        />
      </main>
    </div>
  );
};
