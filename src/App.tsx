import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown/Dropdown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const { name, born, died } = selectedPerson || peopleFromServer[0];

  const selectPerson = selectedPerson
    ? `${name} (${born} - ${died})`
    : 'No selected person';

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectPerson}
        </h1>
        <Dropdown
          onSelected={person => setSelectedPerson(person)}
          delay={300}
        />
      </main>
    </div>
  );
};
