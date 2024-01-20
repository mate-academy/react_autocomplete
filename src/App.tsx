import { useState } from 'react';
import './App.scss';
import { Autocomplete } from './components/Autocomplite';
import { Title } from './components/Title';
import { Person } from './types/Person';

export const App: React.FC = () => {
  // eslint-disable-next-line max-len
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <Title
        isSelected={selectedPerson}
      />

      <Autocomplete onSelected={() => setSelectedPerson} />
    </main>
  );
};
