import React, { useMemo, useState } from 'react';
import cn from 'classnames';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Input } from './components/Input';
import { Dropdown } from './components/Dropdown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const filteredPeople = useMemo(() => {
    return peopleFromServer
      .filter(person => person.name.toLowerCase()
        .includes(appliedQuery.toLowerCase()));
  }, [appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className={cn('dropdown', { 'is-active': isFocused })}>
        <Input
          query={query}
          setQuery={setQuery}
          setAppliedQuery={setAppliedQuery}
          setIsFocused={setIsFocused}
          delay={1000}
        />

        <Dropdown
          filteredPeople={filteredPeople}
          setSelectedPerson={setSelectedPerson}
          setQuery={setQuery}
          setIsFocused={setIsFocused}
        />
      </div>
    </main>
  );
};
