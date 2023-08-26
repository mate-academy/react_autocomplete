import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';

import { peopleFromServer } from './data/people';

import { Person } from './types/Person';
import { DropDownMenu } from './components/DropDownMenu';
import { QueryInput } from './components/QueryInput';

export const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [focused, setFocused] = useState<boolean>(false);

  const filteredPersons = useMemo(() => {
    return peopleFromServer.filter((person: Person) => {
      const personName = person.name.toLowerCase();
      const text = filterQuery.toLowerCase();

      return personName.includes(text);
    });
  }, [filterQuery]);

  const onSelect = useCallback((person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
  }, []);

  const titleOfH1 = selectedPerson !== null
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
    : 'No selected person';

  return (
    <main className="section">
      <h1 className="title">
        {titleOfH1}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <QueryInput
            query={query}
            setFocused={setFocused}
            setQuery={setQuery}
            setFilterQuery={setFilterQuery}
          />
        </div>

        {focused && (
          <DropDownMenu
            filteredPersons={filteredPersons}
            onSelect={onSelect}
          />
        )}
      </div>
    </main>
  );
};
