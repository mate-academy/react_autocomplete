import React, { useState } from 'react';
import Autocomplete from './components/Autocomplete/Autocomplete';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

type Props = {
  delay: number;
};

const App: React.FC<Props> = ({ delay }) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const { name, born, died } = selectedPerson || {};

  const handleSelectedPerson = (person: Person) => {
    setSelectedPerson(person);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? `${name} (${born} - ${died})` : 'No selected person'}
      </h1>

      <Autocomplete
        people={peopleFromServer}
        delay={delay}
        onSelected={handleSelectedPerson}
      />
    </main>
  );
};

export default App;
