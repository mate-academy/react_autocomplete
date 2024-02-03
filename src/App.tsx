import React, { useState } from 'react';
import 'bulma';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

  const findPerson = (people: Person[], selectPerson: string | null) => {
    return people.find((person: Person) => person.name === selectPerson);
  };

  const renderPersonInfo = () => {
    const foundPerson = findPerson(peopleFromServer, selectedPerson);

    if (foundPerson) {
      const personInfo = `${foundPerson.name} (${foundPerson.born} - ${foundPerson.died})`;

      return (
        <h1 className="title" key={selectedPerson}>
          {personInfo}
        </h1>
      );
    }

    return null;
  };

  return (
    <main className="section">
      {selectedPerson && renderPersonInfo()}

      {!selectedPerson && (
        <h1 className="title">
          No selected person
        </h1>
      )}

      <Autocomplete onSelected={(person) => setSelectedPerson(person)} />
    </main>
  );
};
