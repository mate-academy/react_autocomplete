import { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { PersonSelect } from './components/PersonSelect/PersonSelect';
import { Person } from './types/Person';
import { MESSAGES } from './enums';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const { name, born, died } = selectedPerson || {};

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? (
          `${name} (${born} - ${died})`
        ) : (
          MESSAGES.noSelectedPerson
        )}
      </h1>
      <PersonSelect
        people={peopleFromServer}
        onSelect={setSelectedPerson}
      />
    </main>
  );
};
