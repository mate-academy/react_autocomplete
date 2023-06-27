import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import debounce from 'lodash/debounce';
import { peopleFromServer } from './data/people';
import { AppContext } from './AppContext';
import { List } from './components/List';

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
    const normQuery = appliedQuery.toLowerCase().trim();

    return peopleFromServer.filter(
      person => person.name.toLowerCase().includes(normQuery),
    );
  }, [people, appliedQuery]);

  const handleClick = useCallback((person: string) => {
    setSelectedPerson(person);
    setPeople([]);
    setPersonName('');
  }, []);

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

        <List />
      </main>
    </AppContext.Provider>
  );
};
