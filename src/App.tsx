import React from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Title } from './components/Title';
import { Dropdown } from './components/Dropdown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = React.useState<Person | null>(
    null,
  );

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <Title person={selectedPerson} />
        <Dropdown people={peopleFromServer} onSelect={setSelectedPerson} />
      </main>
    </div>
  );
};
