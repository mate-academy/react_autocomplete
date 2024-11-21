import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { AutoComplete } from './component/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const { name, born, died } = selectedPerson || peopleFromServer[0];

  const handleSelect = (person: Person | null) => {
    setSelectedPerson(person);
  };

  const selectedPersonTitle = selectedPerson
    ? `${name} (${born} - ${died})`
    : 'No selected person';

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPersonTitle}
        </h1>
        <AutoComplete onSelected={handleSelect} delay={300} />
      </main>
    </div>
  );
};
