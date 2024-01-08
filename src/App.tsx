import { useState } from 'react';
import './App.scss';
import { Autocomplete } from './Autocomplete/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [person, setPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {
          person
            ? `${person.name} (${person.born} = ${person.died})`
            : <p className="title">No selected person</p>
        }
      </h1>

      <Autocomplete
        delay={1000}
        onSelect={setPerson}
      />
    </main>
  );
};
