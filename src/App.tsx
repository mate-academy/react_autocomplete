import React, { useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete/Autocomplete';
import { getPersonInfo } from './helpers/helpers';

const DEBOUNCE_DELAY = 1000;

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {getPersonInfo(selectedPerson)}
      </h1>

      <Autocomplete
        delay={DEBOUNCE_DELAY}
        onSelected={setSelectedPerson}
      />
    </main>
  );
};
