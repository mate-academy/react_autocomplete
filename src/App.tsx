/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

function getFilteredPeople(people: Person[], search: string): Person[] {
  let filteredPeople = [...people];

  if (search) {
    const normalizedSearch = search.toLowerCase().trim();

    filteredPeople = filteredPeople.filter(person =>
      person.name.toLowerCase().includes(normalizedSearch),
    );
  }

  return filteredPeople;
}

export const App: React.FC = () => {
  const [appliedSearch, setAppliedSearch] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const filteredPeople = useMemo(
    () => getFilteredPeople(peopleFromServer, appliedSearch),
    [appliedSearch],
  );

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`
            : 'No selected person'}
        </h1>
        <Autocomplete
          filteredPeople={filteredPeople}
          onAppliedSearch={setAppliedSearch}
          onSelected={setSelectedPerson}
        />
      </main>
    </div>
  );
};
