import { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './Components/Autocomplete';
import { Person } from './types/Person';
export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const isSelectedPerson = selectedPerson === null;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {!isSelectedPerson
            ? `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <Autocomplete
            people={peopleFromServer}
            onSelected={setSelectedPerson}
          />
        </div>
      </main>
    </div>
  );
};
