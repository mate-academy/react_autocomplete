import React, { useCallback, useState } from 'react';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const onSelect = useCallback((person: Person | null) => {
    setSelectedPerson(person);
  }, []);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <Autocomplete
          dropdownOptions={peopleFromServer}
          searchKey="name"
          keyExtractor={person => person.slug}
          renderOption={person => (
            <div
              className="dropdown-item"
              data-cy="suggestion-item"
              data-slug={person.slug}
            >
              <p className="has-text-link">{person.name}</p>
            </div>
          )}
          onSelect={onSelect}
        />
      </main>
    </div>
  );
};
