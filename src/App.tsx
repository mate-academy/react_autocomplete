import { useState } from 'react';
import './App.scss';
import { Autocomplete } from './Autocomplete/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [person, setPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      {person ? (
        <h1 className="title">
          {`${person.name} (${person.born} = ${person.died})`}
        </h1>
      ) : (
        <p className="title">No selected person</p>
      )}

      <Autocomplete
        delay={1000}
        onSelect={setPerson}
      />
    </main>
  );
};
