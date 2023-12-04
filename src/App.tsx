import React, { useState, useMemo, useCallback } from 'react';
import { debounce } from 'lodash';

import './App.scss';
import Information from './components/Information/Information';
import DropDownList from './components/DropDownList/DropDownList';
import { Person } from './types/Person';

import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);
  const [hasNoResultError, setHasNoResultError] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');
  const delay = 1000;

  const applyQuery = useCallback(
    debounce((value: string) => {
      setAppliedQuery(value);
    }, delay),
    [setAppliedQuery],
  );

  const filteredPeople = useMemo(() => {
    setHasNoResultError(false);

    const arrayOfPeople = peopleFromServer.filter((item: Person) => {
      return item.name.toLowerCase().includes(appliedQuery.toLowerCase());
    });

    if (arrayOfPeople.length === 0) {
      setHasNoResultError(true);
    }

    return arrayOfPeople;
  }, [appliedQuery]);

  const handleQueryChange = (name: string) => {
    applyQuery(name);
  };

  return (
    <main className="section">
      <Information
        currentPerson={currentPerson}
      />

      <DropDownList
        filteredPeople={filteredPeople}
        handleQueryChange={handleQueryChange}
        hasNoResultError={hasNoResultError}
        setCurrentPerson={(person) => setCurrentPerson(person)}
      />
    </main>
  );
};
