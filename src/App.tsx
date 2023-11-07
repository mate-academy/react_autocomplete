import React, { useState } from 'react';

import './App.scss';
import { peopleFromServer } from './data/people';
import { SearchForm } from './components/SearchForm/SearchForm';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          : 'No selected person' }

      </h1>

      <SearchForm
        people={peopleFromServer}
        onSelected={(person) => setSelectedPerson(person)}
        delay={1000}
      />
    </main>
  );
};
