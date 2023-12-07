import './App.scss';

import { FC, useState } from 'react';
import { Dropdown } from './components/Dropdown';
import { Person } from './types/Person';

export const App: FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const { name, born, died } = selectedPerson || {};

  const getSelectedPerson = (person: Person) => (
    setSelectedPerson(person)
  );

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? (
          `${name} (${born}) - (${died})`
        ) : 'No selected person'}
      </h1>

      <Dropdown
        onSelected={getSelectedPerson}
        delay={1000}
      />

    </main>
  );
};
