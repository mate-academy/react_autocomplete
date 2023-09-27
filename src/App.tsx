import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash/debounce';

import './App.scss';
import { peopleFromServer } from './data/people';
import { PeopleContext } from './components/PeopleContext';
import { People } from './components/People';

export const App: React.FC = () => {
  const [people, setPeople] = useState(peopleFromServer);
  const [personName, setPersonName] = useState('');
  const [selectedPerson, setSelectedPerson] = useState('No selected person');

  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(
    debounce(
      setAppliedQuery,
      1000,
    ),
    [],
  );

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(
      person => person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [people, appliedQuery]);

  const handleClick = useCallback(
    (person: string) => {
      setSelectedPerson(person);
      setPeople([]);
      setPersonName('');
    },
    [],
  );

  const context = {
    personName,
    setPersonName,
    applyQuery,
    filteredPeople,
    handleClick,
  };

  return (
    <PeopleContext.Provider value={context}>
      <main className="section">
        <h1 className="title">
          {selectedPerson}
        </h1>

        <People />
      </main>
    </PeopleContext.Provider>

  );
};
