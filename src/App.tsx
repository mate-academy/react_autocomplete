import React, { useState } from 'react';
import Autocomplete from './components/Autocomplete/Autocomplete';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

interface AppProps {
  debounceDelay: number;
  noMatchesMessage: string;
}

export const App: React.FC<AppProps> = ({
  debounceDelay,
  noMatchesMessage,
}) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <Autocomplete
        debounceDelay={debounceDelay}
        noMatchesMessage={noMatchesMessage}
        onSelectPerson={handleSelectPerson}
        people={peopleFromServer}
      />
    </main>
  );
};

export default App;
