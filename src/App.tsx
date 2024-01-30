import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete/Autocomplete';

interface Props {
  debounceTimeout?: number;
}

export const App: React.FC<Props> = ({ debounceTimeout = 300 }) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
  };

  const handleReset = () => {
    setSelectedPerson(null);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <Autocomplete
          items={peopleFromServer}
          debounceTimeout={debounceTimeout}
          onSelect={handlePersonSelect}
          onReset={handleReset}
        />
      </main>
    </div>
  );
};
