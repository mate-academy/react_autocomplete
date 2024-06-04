import React, { useState, useMemo, useEffect } from 'react';

import './App.scss';

import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown/Dropdown';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const visiblePeople: Person[] = useMemo(
    () =>
      peopleFromServer.filter(({ name }) =>
        name.toLowerCase().includes(appliedQuery),
      ),
    [appliedQuery],
  );

  const onSelected = (person: Person) => {
    setSelectedPerson(() => person);
    setDropdownVisible(() => false);
  };

  useEffect(() => {
    setDropdownVisible(false);
  }, [query]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <Dropdown
          delay={300}
          visiblePeople={visiblePeople}
          dropdownVisible={dropdownVisible}
          query={query}
          onSelected={onSelected}
          setSelectedPerson={setSelectedPerson}
          setDropdownVisible={setDropdownVisible}
          setQuery={setQuery}
          setAppliedQuery={setAppliedQuery}
        />
      </main>
    </div>
  );
};
