import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown';
import { PersonInfo } from './components/PersonInfo';

function debounce<T>(callback: (value: T) => void, deley: number) {
  let timerId: NodeJS.Timeout;

  return (...args: [T]) => {
    clearTimeout(timerId);
    timerId = setTimeout(callback, deley, ...args);
  };
}

export const App: React.FC = () => {
  const [appliedQuery, setAppliedQuery] = useState<string>('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(
    null,
  );
  const applyQuery = useCallback(
    debounce<string>(setAppliedQuery, 1000),
    [],
  );

  const getVisiblePeople = () => {
    const query = appliedQuery.trim().toLowerCase();

    return query
      ? peopleFromServer.filter(
        ({ name }) => name
          .toLowerCase()
          .includes(query),
      ) : null;
  };

  const visiblePersons = useMemo(
    getVisiblePeople,
    [appliedQuery],
  );

  return (
    <main className="section">

      <h1 className="title">
        {(
          selectedPerson
          && <PersonInfo person={selectedPerson} />
        )
          || 'No selected person'}
      </h1>

      <Dropdown
        applyQuery={applyQuery}
        setSelectedPerson={setSelectedPerson}
        visiblePersons={visiblePersons}
      />
    </main>
  );
};
