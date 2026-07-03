import debounce from 'lodash.debounce';
import React, { useMemo, useState } from 'react';
import './App.scss';
import { Autocomplete } from './components/autocomplete/Autocomplete';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { UserInfo } from './components/selectedUserInfo/UserInfo';
import { peopleFromServer } from './data/people';

interface Props {
  delayMS: number;
}

export const App: React.FC<Props> = ({ delayMS = 300 }) => {
  const [personName, setPersonName] = useState('');
  const [debouncePersonName, setDebouncePersonName] = useState('');

  const debouncedSearch = useMemo(
    () =>
      debounce((newValue: string) => {
        setDebouncePersonName(newValue);
      }, delayMS),
    [delayMS],
  );

  const handleNameChange = (value: string) => {
    setPersonName(value);
    debouncedSearch(value);
  };

  const filteredPersons = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name
        .trim()
        .toLowerCase()
        .includes(debouncePersonName.trim().toLowerCase()),
    );
  }, [debouncePersonName]);

  const selectedPerson = peopleFromServer.find(
    person => person.name === personName,
  );

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
          setPersonName={handleNameChange}
        />
        {filteredPersons.length <= 0 && <ErrorMessage />}
      </main>
    </div>
  );
};
