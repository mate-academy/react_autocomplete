import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown';

type SetQuaryFunc = (value: string) => void;

function debonce(func: SetQuaryFunc, deley: number) {
  let timerId: number;

  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(func, deley, ...args);
  };
}

export const App: React.FC = () => {
  const [applyedQuery, setApplyedQuery] = useState<string>('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(
    null,
  );

  const applyQuery = useCallback(
    debonce(setApplyedQuery, 1000),
    [],
  );

  const getVisiblePeople = () => {
    const query = applyedQuery.trim().toLowerCase();

    return query
      ? peopleFromServer.filter(
        ({ name }) => name
          .toLowerCase()
          .includes(query),
      ) : null;
  };

  const visiblePersones = useMemo(
    getVisiblePeople,
    [applyedQuery],
  );

  return (
    <main className="section">

      <h1 className="title">
        {(
          selectedPerson
          && `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`)
          || 'No selected person'}
      </h1>

      <Dropdown
        applyQuery={applyQuery}
        setSelectedPerson={setSelectedPerson}
        visiblePersones={visiblePersones}
      />
    </main>
  );
};
