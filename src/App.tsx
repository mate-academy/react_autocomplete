import React, { useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

import { Dropdown } from './components/Dropdown';
import { User } from './components/User';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const debounceValue = 300;

  const applyQuery = useMemo(
    () => debounce(setAppliedQuery, debounceValue),
    [setAppliedQuery],
  );

  const filteredPerson = useMemo(() => {
    if (appliedQuery.trim().length > 0) {
      return peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(appliedQuery.toLowerCase().trim()),
      );
    }

    return peopleFromServer;
  }, [appliedQuery]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();

    setQuery(value);
    applyQuery(value);
    setSelectedPerson(null);
  };

  const handleSuggest = (person: Person) => {
    setQuery(person.name);
    setSelectedPerson(person);
    setIsFocused(false);
  };

  const setFocused = (val: boolean) => {
    setIsFocused(val);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <User selectedPerson={selectedPerson} />

        <Dropdown
          handleSuggest={handleSuggest}
          filteredPerson={filteredPerson}
          delay={debounceValue}
          query={query}
          isFocused={isFocused}
          setFocused={setFocused}
          handleInput={handleInput}
        />
      </main>
    </div>
  );
};
