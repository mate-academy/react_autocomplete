import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { PeopleList } from './components/PeopleList';
import { PeopleSearchBar } from './components/PeopleSearchBar';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<Person | null>(null);

  const filteredPeople = useMemo(() => {
    return [...peopleFromServer]
      .filter((person) => person.name.toLowerCase()
        .includes(appliedQuery.toLowerCase()));
  }, [peopleFromServer, appliedQuery]);

  return (
    <main className="section">
      {selectedUser ? (
        <h1 className="title">
          {`${selectedUser.name} (${selectedUser.born} = ${selectedUser.died})`}
        </h1>
      ) : (
        <h1 className="title">No selected person</h1>
      )}

      <div className="dropdown is-active">
        <PeopleSearchBar
          onType={setQuery}
          query={query}
          setAppliedQuery={setAppliedQuery}
          delay={1000}
        />
        {appliedQuery && (
          <PeopleList people={filteredPeople} onSelected={setSelectedUser} />
        )}
      </div>
    </main>
  );
};
