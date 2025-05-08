import React, { useState, useCallback } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './Autocomplete';

interface Person {
  name: string;
  born: number;
  died: number;
  sex: string;
  fatherName: string | null;
  motherName: string | null;
  slug: string;
}

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  // ✅ Wrapped in useCallback for stable reference
  const handleSelect = useCallback((person: Person | null) => {
    setSelectedPerson(person);
  }, []);

  return (
    <div className="container">
      <h1 className="title" data-qa="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <Autocomplete
        people={peopleFromServer}
        delay={300}
        onSelected={handleSelect}
      />
    </div>
  );
};
