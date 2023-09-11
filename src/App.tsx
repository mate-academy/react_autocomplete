import React, { useState } from 'react';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { PeopleDropdown } from './components/PeopleDropdown/PeopleDropdown';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const selectedPersonInfo = `${selectedPerson?.name} (${selectedPerson?.born} = ${selectedPerson?.died})`;

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? selectedPersonInfo : 'No selected person'}
      </h1>

      <PeopleDropdown
        peopleList={peopleFromServer}
        onSelected={(person: Person) => setSelectedPerson(person)}
        delay={500}
      />
    </main>
  );
};
