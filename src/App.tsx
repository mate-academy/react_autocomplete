import { useState } from 'react';
import { Person } from './types/Person';
import { Title } from './components/Title';
import { Autocomplete } from './components/Autocomplete';
import './App.scss';

import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <Title person={selectedPerson} />

      <Autocomplete
        people={peopleFromServer}
        delayInSeconds={1}
        onSelected={setSelectedPerson}
      />
    </main>
  );
};
