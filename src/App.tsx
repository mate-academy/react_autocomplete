import React, {
  ChangeEvent, useCallback, useMemo, useState,
} from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { PeopleMatch } from './components/Autocomplete';
import { Person } from './types/Person';

const presentPeople = [...peopleFromServer];

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const handleQueryChange = useCallback((
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  }, []);

  const handleSelectedPerson = useCallback((person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setAppliedQuery(person.name);
    setIsFocused(false);
  }, []);

  const filteredPeople = useMemo(() => {
    return presentPeople.filter(
      person => person.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [appliedQuery, presentPeople]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? (
          `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
        ) : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            className="input"
            placeholder="Enter a part of the name"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setIsFocused(true)}
          />
        </div>

        <PeopleMatch
          people={filteredPeople}
          onFocus={isFocused}
          onSelect={handleSelectedPerson}
        />
      </div>
    </main>
  );
};
