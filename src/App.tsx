import { FC, useState, useMemo } from 'react';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown';
import { Person } from './types/Person';
import './App.scss';

export const App: FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const personInfo = useMemo(() => {
    if (selectedPerson) {
      const { name, born, died } = selectedPerson;

      return `${name} (${born} - ${died})`;
    }

    return 'No selected person';
  }, [selectedPerson]);

  return (
    <main className="section">
      <h1 className="title">{personInfo}</h1>

      <Dropdown
        people={peopleFromServer}
        onSelected={setSelectedPerson}
        selectedPerson={selectedPerson}
      />
    </main>
  );
};
