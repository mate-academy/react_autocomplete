import React, { useCallback, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [autocompleteKey, setAutocompleteKey] = useState(0);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [filteredPeople, setFilteredPeople] =
    useState<Person[]>(peopleFromServer);

  const { name, born, died, slug } = selectedPerson || {};

  const filterPeople = useCallback((query: string) => {
    const filteredPeopleFromServer = peopleFromServer.filter(currentPerson => {
      const personName = currentPerson.name.toLowerCase();
      const queryLower = query.toLowerCase();

      return personName.includes(queryLower);
    });

    setFilteredPeople(filteredPeopleFromServer);
  }, []);

  const onPersonSelect = (person: Person | null) => {
    if (person) {
      setAutocompleteKey(currentKey => currentKey + 1);
    }

    setSelectedPerson(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {selectedPerson ? (
          <h1 key={slug} className="title" data-cy="title">
            {`${name} (${born} - ${died})`}
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        )}

        <Autocomplete
          key={autocompleteKey}
          onPersonSelect={onPersonSelect}
          people={filteredPeople}
          selectedPerson={selectedPerson}
          onQuery={filterPeople}
        />

        {!filteredPeople.length && (
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
