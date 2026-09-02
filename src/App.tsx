import React, { useEffect, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const persons = useMemo(() => [...peopleFromServer], []);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');

  const handleQueryStringChange = (value: string) => {
    setQuery(value);
  };

  useEffect(() => {
    if (selectedPerson && query !== selectedPerson.name) {
      setSelectedPerson(null);
    }
  }, [query, selectedPerson]);

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : `No selected person`}
        </h1>
        <Autocomplete
          persons={persons}
          onQueryChange={handleQueryStringChange}
          onSelected={handleSelectPerson}
          query={query}
          debounceDelay={300}
        />
        {persons.length === 0 && (
          <div
            className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
            "
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
