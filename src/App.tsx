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

  const filterPeople = useCallback((query: string) => {
    const filteredPeopleFromServer = peopleFromServer.filter(currentPerson =>
      currentPerson.name.toLowerCase().includes(query.toLowerCase()),
    );

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
          <h1 key={selectedPerson.slug} className="title" data-cy="title">
            {`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
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
            // eslint-disable-next-line max-len
            className="notification is-danger is-light mt-3 is-align-self-flex-start"
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
