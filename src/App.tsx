import { useState } from 'react';
import { Form } from './components/form';
import './App.scss';
import { peopleFromServer } from './data/people';

import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson !== null
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : `No selected person`}
        </h1>
        <Form
          people={peopleFromServer}
          selectPerson={setSelectedPerson}
          selectedPerson={selectedPerson}
        />
      </main>
    </div>
  );
};
