import React, { useCallback, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

const START_PHRASE = 'No selected person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleSelected = useCallback((person: Person) => {
    setSelectedPerson(person);
  }, []);

  const handleInputChange = (inputValue: string) => {
    if (inputValue.trim() === '') {
      setSelectedPerson(null);
    } else {
      setSelectedPerson(null);
    }
  };

  const { name, born, died } = selectedPerson || {};

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson ? `${name} (${born} - ${died})` : START_PHRASE}
        </h1>
        <Autocomplete
          people={peopleFromServer}
          onSelected={handleSelected}
          onInputChange={handleInputChange}
        />
      </main>
    </div>
  );
};
