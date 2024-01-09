import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import debounce from 'lodash/debounce';
import { peopleFromServer } from './data/people';
import { AppContext } from './AppContext';
import { People } from './components/People';

export const App: React.FC = () => {
  const [, setPeople] = useState(peopleFromServer);
  const [personName, setPersonName] = useState('');
  const [selectedPerson, setSelectedPerson] = useState('No Person is selected');

  const [applyQuery, setApplyQuery] = useState('');

  const appliedQuery = useCallback(
    (value) => debounce(setApplyQuery, 1000)(value),
    [],
  );

  const filterPeople = useMemo(() => {
    return peopleFromServer.filter(
      person => person.name.toLowerCase().includes(applyQuery.toLowerCase()),
    );
  }, [applyQuery]);

  const handleClick = useCallback(
    (person: string) => {
      setPeople([]);
      setPersonName('');
      setSelectedPerson(person);
    }, [],
  );

  const context = {
    personName,
    setPersonName,
    appliedQuery,
    filterPeople,
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
