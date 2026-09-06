import { useState } from 'react';

import './App.scss';

import peopleFromServer from './data/people';
import { Autocomplete } from './Autocomplete';
import { Person } from './types/Person';

export const App = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleSelected = (person: Person) => {
    setSelectedPerson(person);
  };

  const handleInputChange = () => {
    setSelectedPerson(null);
  };

  return (
    <div className="App">
      <h1 data-cy="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <Autocomplete
        people={peopleFromServer}
        onSelected={handleSelected}
        onChange={handleInputChange}
      />
    </div>
  );
};
