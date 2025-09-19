import React, { useMemo } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [person, setPerson] = React.useState<Person | null>(null);
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const handleSearchTermChange = (query: string) => {
    setSearchQuery(query);
  };

  const filteredPeople = useMemo(() => {
    return searchQuery.trim() === ''
      ? peopleFromServer
      : peopleFromServer.filter(pers =>
        pers.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
  }, [searchQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {person
            ? `${person.name} (${person.born} - ${person.died})`
            : 'No selected person'}
        </h1>
        <Autocomplete
          people={filteredPeople}
          onSearchTermChange={handleSearchTermChange}
          onSelected={setPerson}
        />
      </main>
    </div>
  );
};
