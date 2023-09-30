import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { DropDownItem } from './components/DropDownItem';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const delay = 1000;

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), [delay]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
    setQuery('');
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(
      (person) => person.name
        .toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No person selected'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.length ? (
              filteredPeople.map((person) => (
                <DropDownItem
                  onSelect={handlePersonSelect}
                  key={person.slug}
                  person={person}
                />
              ))
            ) : (
              <p>No matching suggestions</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
