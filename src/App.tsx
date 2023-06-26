import React, { useMemo, useState } from 'react';
import './App.scss';
// import { debounce } from 'lodash';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown';

export const App: React.FC = () => {
  const [searchName, setSearchName] = useState('');
  const [selectedPersonSlug, setSelectedPersonSlug] = useState('');

  const people = useMemo(() => (
    peopleFromServer.filter(person => (
      person.name.toLowerCase().includes(searchName.toLowerCase().trim())
    ))
  ), [searchName]);

  const findSelectedPerson = useMemo(() => (
    peopleFromServer.find(person => (
      person.slug === selectedPersonSlug
    )) || null
  ), [selectedPersonSlug]);

  return (
    <main className="section">
      {selectedPersonSlug
        ? (
          <h1 className="title">
            {`${findSelectedPerson?.name} (${findSelectedPerson?.born} - ${findSelectedPerson?.died})`}
          </h1>
        ) : (
          <h1 className="title">
            No selected person
          </h1>
        )}

      <Dropdown
        people={people}
        searchName={searchName}
        setSearchName={(value: string) => setSearchName(value)}
        setSelectedPersonSlug={setSelectedPersonSlug}
        findSelectedPerson={findSelectedPerson}
      />
    </main>
  );
};
