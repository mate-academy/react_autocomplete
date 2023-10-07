import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown';
import { Person } from './types/Person';
import { PersonInfo } from './components/PersonInfo';

export const App: React.FC = () => {
  const [peopleArr] = useState<Person[]>(peopleFromServer);
  const [query, setQuery] = useState('');
  const [applyQuery, setApplyQuery] = useState('');
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);

  const filteredArr = useMemo(() => {
    return peopleArr.filter((person: Person) => {
      return person.name.toLowerCase().includes(applyQuery.toLowerCase());
    });
  }, [peopleArr, applyQuery]);

  return (
    <main className="section">
      <PersonInfo currentPerson={currentPerson} />

      <Dropdown
        people={filteredArr}
        query={query}
        setQuery={setQuery}
        setApplyQuery={setApplyQuery}
        setCurrentPerson={setCurrentPerson}
        delay={1000}
      />
    </main>
  );
};
