import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter((person) => {
      const lowerName = person.name.toLowerCase();
      const lowerQuery = appliedQuery.toLowerCase();

      return lowerName.includes(lowerQuery);
    });
  }, [appliedQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <Autocomplete
          people={filteredPeople}
          query={query}
          onChange={setQuery}
          onQueryChange={setAppliedQuery}
          onSelect={setSelectedPerson}
        />

        {filteredPeople.length === 0 && (
          <div
            className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start"
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </main>
    </div>
  );
};
