import React, { useState } from 'react';
import './App.scss';
import { Autocomplete } from './component/Autocomplete/Autocomplete';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const onSelected = (person: Person | null) => {
    setSelectedPerson(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {selectedPerson && (
          <h1 className="title" data-cy="title">
            {selectedPerson
              ? `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`
              : 'No selected person'}
          </h1>
        )}

        <Autocomplete people={peopleFromServer} onSelect={onSelected} />
      </main>
    </div>
  );
};
