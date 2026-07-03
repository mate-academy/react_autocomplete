import debounce from 'lodash.debounce';
import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { Autocomplete } from './components/autocomplete/Autocomplete';
import { UserInfo } from './components/selectedUserInfo/UserInfo';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

interface Props {
  delayMS?: number;
}

export const App: React.FC<Props> = ({ delayMS = 300 }) => {
  const [personName, setPersonName] = useState('');
  const [debouncePersonName, setDebouncePersonName] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | undefined>(
    undefined,
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((newValue: string) => {
        const trimmed = newValue.trim();

        setDebouncePersonName(prev => (prev === trimmed ? prev : trimmed));
      }, delayMS),
    [delayMS],
  );

  const handleNameChange = useCallback(
    (value: string) => {
      setPersonName(value);
      debouncedSearch(value);
      setSelectedPerson(undefined);
    },
    [debouncedSearch],
  );

  const filteredPersons = useMemo(() => {
    if (!debouncePersonName) {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person =>
      person.name
        .trim()
        .toLowerCase()
        .includes(debouncePersonName.trim().toLowerCase()),
    );
  }, [debouncePersonName]);

  const handleSelected = useCallback((person: Person) => {
    setSelectedPerson(person);
    setPersonName(person.name);
    setDebouncePersonName(person.name.trim());
  }, []);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {selectedPerson ? (
          <UserInfo person={selectedPerson} />
        ) : (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        )}
        <Autocomplete
          persons={filteredPersons}
          personName={personName}
          onNameChange={handleNameChange}
          onSelected={handleSelected}
        />
      </main>
    </div>
  );
};
