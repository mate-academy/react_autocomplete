import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown/Dropdown';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [visibleDropdown, setVisibleDropdown] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const delay = 300;

  const applyQuery = useMemo(
    () => debounce(setAppliedQuery, delay),
    [setAppliedQuery, delay],
  );

  const onChangeQuery = (newQuery: string) => {
    setQuery(newQuery);
    applyQuery(newQuery);
    setSelectedPerson(null);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  const onSelected = (person: Person) => {
    setVisibleDropdown(false);
    setSelectedPerson(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {selectedPerson ? (
          <h1 className="title" data-cy="title">
            {`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        )}

        <Dropdown
          visibleDropdown={visibleDropdown}
          setVisibleDropdown={setVisibleDropdown}
          people={filteredPeople}
          onSelected={onSelected}
          query={query}
          onChangeQuery={onChangeQuery}
        />
      </main>
    </div>
  );
};
