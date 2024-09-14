import './App.scss';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';
import { useState } from 'react';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const onSelected = (person: Person | null) => {
    setSelectedPerson(person);
  };

  const selectedPersonInfo = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
    : 'No selected person';

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPersonInfo}
        </h1>

        <Autocomplete
          onSelected={onSelected}
          setSelectedPerson={setSelectedPerson}
        />
      </main>
    </div>
  );
};
