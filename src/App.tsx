import React, { useState } from 'react';
import './App.scss';
// import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { IntputComponent } from './components/InputComponent';

export const App: React.FC = React.memo((() => {
  const [people] = useState(peopleFromServer);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson && `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`}
      </h1>

      <IntputComponent
        delay={1000}
        people={people}
        onSelected={(v) => setSelectedPerson(v)}
      />
    </main>
  );
}));
