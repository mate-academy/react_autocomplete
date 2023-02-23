import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash/debounce';

import './App.scss';
import { peopleFromServer } from './data/people';
import { AppContext } from './AppAContext';
import { People } from './components/People';

export const App: React.FC = () => {
  const [people, setPeople] = useState(peopleFromServer);
  const [personName, setPersonName] = useState('');
  const [selectedPerson, setSelectedPerson] = useState('No Person is selected');

  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(
    debounce(
      setAppliedQuery,
      500,
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
    <AppContext.Provider value={context}>
      <main className="section">
        <h1 className="title">
          {selectedPerson}
        </h1>

        <People />
      </main>
    </AppContext.Provider>
  );
};
