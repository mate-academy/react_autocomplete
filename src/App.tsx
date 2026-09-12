import { useState } from 'react';

import './App.scss';

import { Person } from './types/Person';

import { Dropdown } from './components/Dropdown/Dropdown';

export const App = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <Dropdown
          onSelected={person => setSelectedPerson(person)}
          onInputChange={() => setSelectedPerson(null)}
          delay={300}
        />
      </main>
    </div>
  );
};
