import React, { useCallback, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSElectedPerson] = useState<Person | null>(null);

  const getYear = useCallback((person: Person) => {
    const { name, born, died } = person;

    return `${name} (${born} - ${died})`;
  }, [selectedPerson]);

  const title = selectedPerson
    ? getYear(selectedPerson)
    : 'No selected person';

  return (
    <main className="section">
      <h1 className="title">
        {title}
      </h1>

      <Autocomplete
        people={peopleFromServer}
        onSelected={setSElectedPerson}
        delay={1000}
      />

    </main>
  );
};
